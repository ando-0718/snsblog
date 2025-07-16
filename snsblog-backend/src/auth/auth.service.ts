// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('メールアドレスまたはパスワードが間違っています')
    }
    return user
  }

  generateAccessToken(userId: string) {
    return this.jwtService.sign({ sub: userId })
  }

  generateRefreshToken(userId: string) {
    return this.jwtService.sign({ sub: userId }, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: '7d',
    })
  }
}
