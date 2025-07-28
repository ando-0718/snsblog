'use server'

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { emailField, passwordField } from '../../utils/zod/schema';

export const loginSchema = z.object({
  emailField,
  passwordField
});

//LoginFormStateが必要なければ削除する
export type LoginFormState = {
  errors?: {
    email?: string
    password?: string
    emailAlready?:string
  }
};

export async function loginAction(
  //LoginFormStateが必要なければ削除する
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  };
  const result = loginSchema.safeParse(raw);
  if (!result.success) {
    const errorTree = z.treeifyError(result.error);
    const emailErrors = errorTree.properties?.emailField?.errors ?? [];
    const passwordErrors = errorTree.properties?.passwordField?.errors ?? [];
    const emailError = emailErrors[0] ?? null;
    const passwordError = passwordErrors[0] ?? null;
    return {
      errors: {
        email: emailError,
        password: passwordError
      }
    };
  }

  const { emailField, passwordField } = result.data
  //apiは確認する
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Cookie送信のため
    body: JSON.stringify({ emailField, passwordField }),
  })

  if (!res.ok) {
    //ここにはサーバーからのメッセージを格納
    //return { errors: 'ログインに失敗しました。' }
  }

  //この部分のパスは修正する
  redirect('/dashboard') // 成功時にリダイレクト
}