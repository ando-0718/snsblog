import { useActionState } from "react";
import Link from 'next/link'; 
import { loginAction } from '@/app/actions/login-action'
import type { LoginType } from '@/types/login-types'

export default function LoginPage() {
  const initialState: LoginType = {
    errors: {
      email: [],
      password: [],
      server: null
    }
  }
  const [state, formAction] = useActionState(loginAction, initialState)

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded">
      <h1 className="text-2xl font-bold mb-4">ログイン</h1>
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        {state.errors?.email?.map((err, i) => ( 
          <p key={i} className="text-red-500 text-sm">{err}</p>
        ))}
        <div>
          <label htmlFor="password">パスワード</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        {state.errors?.password?.map((err, i) => (
          <p key={i} className="text-red-500 text-sm">{err}</p>
        ))}
        {state.errors?.server && (
          <p className="text-red-500 text-sm">{state.errors?.server}</p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          ログイン
        </button>
      </form>
      <div className="mt-4 flex justify-between text-sm text-blue-600 underline">
        <Link href="/register">新規登録はこちら</Link>
        <Link href="/reset-password">パスワードを忘れた方はこちら</Link>
      </div>
    </div>
  )
}