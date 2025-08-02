'use server'

import { config } from '@/lib/config';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { emailField, passwordField } from '@/utils/zod/schema';
//これはいらなくなるかも
import type { LoginType } from '@/types/login-types'

export const loginSchema = z.object({
  emailField,
  passwordField
});

//LoginFormStateが必要なければ削除する
export type LoginFormState = {
  errors?: {
    email?: string
    password?: string
    mistake?:string
  }
};

export async function loginAction(
  //LoginFormStateが必要なければ削除する
  prevState: LoginType,
  formData: FormData
): Promise<LoginType> {
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  };
  const result = loginSchema.safeParse(raw);
  if (!result.success) {
    const errorTree = z.treeifyError(result.error) as {
      properties?: {
        email?: { errors?: string[] }
        password?: { errors?: string[] }
      }
    }
    const emailErrors = errorTree.properties?.email?.errors ?? [];
    const passwordErrors = errorTree.properties?.password?.errors ?? [];
    // const emailError = emailErrors[0] ?? null;
    // const passwordError = passwordErrors[0] ?? null;
    return {
      errors: {
        email: emailErrors,
        password: passwordErrors
      }
    };
  }

  const { emailField, passwordField } = result.data
  //apiは確認する
  const res = await fetch(`${config.apiUrl}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Cookie送信のため
    body: JSON.stringify({ emailField, passwordField }),
  })

  if (!res.ok) {
    const server = await res.json();
    return { errors: { 
      server 
      } 
    }
  }

  //この部分のパスは修正する
  redirect('/dashboard') // 成功時にリダイレクト
}