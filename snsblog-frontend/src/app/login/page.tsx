import { useActionState } from "react";
import Link from 'next/link'; 
import { loginAction } from '../actions/login-action'

export default function LoginPage() {
  const initialState = {errors: {}}
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
        {state.errors?.email && (
          <p className="text-red-500 text-sm">{state.errors?.email}</p>
        )}
        {state.errors?.emailAlready && (
          <p className="text-red-500 text-sm">{state.errors?.emailAlready}</p>
        )}
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
        {state.errors?.password && (
          <p className="text-red-500 text-sm">{state.errors?.password}</p>
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