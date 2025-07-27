import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {

  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendVerificationEmail(to: string, url: string) {
    await this.transporter.sendMail({
      from: this.configService.get<string>('EMAIL_FROM'),
      to,
      subject: '本登録メール',
      html: `
        <p>以下のリンクをクリックして本登録を完了してください：</p>  
        <p><a href="${url}">${url}</a></p>
        <p>このリンクの有効期限は10分です。</p>
      `,
    });
  }

  async sendResetPasswordEmail(to: string, resetUrl: string) {
    await this.transporter.sendMail({
      from: this.configService.get<string>('EMAIL_FROM'),
      to,
      subject: 'パスワードリセットメール',
      html: `
        <p>以下のリンクをクリックしてパスワードをリセットしてください：</p>  
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>このリンクの有効期限は10分です。</p>
      `,
     
    });
  }
}