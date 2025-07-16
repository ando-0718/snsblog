// src/auth/auth.controller.ts
import {
  Controller, Post, Body, Res,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { Response } from 'express'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(body.email, body.password)

    const accessToken = this.authService.generateAccessToken(user.id)
    const refreshToken = this.authService.generateRefreshToken(user.id)

    // Cookie にリフレッシュトークンを設定（httpOnly）
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7日
    })

    return { accessToken }
  }
}
