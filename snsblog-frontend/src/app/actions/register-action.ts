'use server'

import { config } from '@/lib/config';
import { emailField, passwordField } from '@/utils/zod/schema';
import { z } from 'zod'
import { redirect } from 'next/navigation';
//これはいらなくなるかも
import type { RegisterType } from '@/types/register-types'

export const registerSchema = z.object({
  emailField,
  passwordField,
  confirmPasswordField: passwordField
}).refine((data) => data.passwordField === data.confirmPasswordField, {
  path: ['confirmPasswordField'],
  message: 'パスワードが一致しません。',
});

// export type ActionState = {
//   errors?: {}
// }

export async function registerAction(
  //いらなくなるかも
  prevState: RegisterType,
  formData: FormData
): Promise<RegisterType> {

  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword')
  };
  const result = registerSchema.safeParse(raw);

  if (!result.success) {
    const errorTree = z.treeifyError(result.error) as {
      properties?: {
        email?: { errors?: string[] }
        password?: { errors?: string[] }
        confirmPassword?: { errors?: string[] }
      }
    }
    const emailErrors = errorTree.properties?.email?.errors ?? [];
    const passwordErrors = errorTree.properties?.password?.errors ?? [];
    const confirmPassworddErrors = errorTree.properties?.confirmPassword?.errors ?? [];
    // const emailError = emailErrors[0] ?? null;
    // const passwordError = passwordErrors[0] ?? null;
    // const confirmPasswordError = confirmPassworddErrors[0] ?? null;
    return {
      errors: {
        email: emailErrors,
        password: passwordErrors,
        confirmPassword: confirmPassworddErrors
      }
    };
  }

  const { emailField, passwordField } = result.data

  const res = await fetch(`${config.apiUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: emailField,
      password: passwordField,
    }),
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