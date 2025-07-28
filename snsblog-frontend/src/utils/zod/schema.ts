import { z } from 'zod';

export const emailField = z
  .string()
  .min(1, { message: 'メールアドレスは必須です' })
  .pipe(
    z.string().refine((val) => val.includes('@'), {
      message: 'メール形式が正しくありません',
    })
  );

  export const passwordField = z
  .string()
  .min(8, { message: 'パスワードは8文字以上で入力してください' })
  .max(32, { message: 'メールアドレスは32文字以内で入力してください' });