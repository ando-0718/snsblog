import { Controller, Post, Body, Res, Get, Query } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto';
import { RequestResetDto } from './dto/request-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: CredentialsDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken, refreshToken } = await this.authService.login(
      dto.email,
      dto.password
    );

    // HTTP Only Cookie にトークンを保存
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      maxAge: 5 * 60 * 1000,
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { message: 'Login successful' };
  }

  @Post('register')
  register(@Body() dto: CredentialsDto) {
    return this.authService.register(dto.email, dto.password);
  }

  @Get('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('request-password-reset')
  requestReset(@Body() dto: RequestResetDto) {
    return this.authService.sendPasswordResetEmail(dto.email);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.password);
  }
}