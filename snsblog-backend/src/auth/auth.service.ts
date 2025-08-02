import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private emailService: EmailService,
    private configService: ConfigService
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
      throw new UnauthorizedException('メールアドレスまたはパスワードが正しくありません。');
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '5m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: string, rt: string) {
    const hashedRt = await bcrypt.hash(rt, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: hashedRt },
    });
  }

  async register(email: string, password: string) {

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('すでにこのメールアドレスは登録されています。');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        isVerified: false,
      },
    });

    const token = this.jwtService.sign({ sub: user.id }, { expiresIn: '10m' });

    const verificationUrl = `${this.configService.get<string>('FRONTEND_URL')}/auth/verify-email?token=${token}`;
    await this.emailService.sendVerificationEmail(email, verificationUrl);

    return { message: '認証メールを送信しました。' };
  }

  async verifyRegister(token: string) {
    const payload = this.jwtService.verify(token);
    const userId = payload.sub;

    await this.prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });

    return { message: '本登録が完了しました。' };
  }

  async sendPasswordResetEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return { message: 'メールが送信されました（存在確認は行いません）' };

    const token = this.jwtService.sign({ sub: user.id }, {
      secret: this.configService.get<string>('JWT_RESET_SECRET'),
      expiresIn: '10m',
    });

    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${token}`;
    await this.emailService.sendResetPasswordEmail(email, resetUrl);

    return { message: 'パスワードリセット用のメールを送信しました' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_RESET_SECRET'),
      });

      const hashed = await bcrypt.hash(newPassword, 10);
      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { hashedPassword: hashed },
      });

      return { message: 'パスワードが更新されました' };
    } catch (err) {
      throw new UnauthorizedException('無効または期限切れのトークンです');
    }
  }
}