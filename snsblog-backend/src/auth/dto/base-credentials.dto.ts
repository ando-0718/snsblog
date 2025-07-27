import { IsEmail, IsString, Length } from 'class-validator';

export class EmailDto {
  @IsEmail({}, { message: 'メールアドレスの形式が正しくありません。' })
  email: string;
}

export class PasswordDto {
  @IsString()
  @Length(8, 32, { message: 'パスワードは8文字以上32文字以下で入力してください。' })
  password: string;
}