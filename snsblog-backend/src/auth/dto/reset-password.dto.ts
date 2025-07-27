import { PasswordDto } from './base-credentials.dto';
import { IsString } from 'class-validator';

export class ResetPasswordDto extends PasswordDto {
  @IsString({ message: 'トークンが不正です。' })
  token: string;
}