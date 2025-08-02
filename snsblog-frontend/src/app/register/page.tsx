import { useActionState } from 'react'
import { registerAction } from '@/app/actions/register-action'
import type { RegisterType } from '@/types/register-types'

export default function RegisterPage() {
  const initialState: RegisterType = {
    errors: {
      email: [],
      password: [],
      confirmPassword: [],
      server: null
    }
  }
  const [state, formAction] = useActionState(registerAction, initialState)

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">新規登録</h1>
      <form action={formAction} className="space-y-4">
        <div>
          <label className="block mb-1">メールアドレス</label>
          <input
            name="email"
            type="email"
            className="w-full border p-2"
            required
          />
          {state.errors?.email?.map((err, i) => ( <p key={i} className="text-red-500 text-sm">{err}</p>))}
        </div>

        <div>
          <label className="block mb-1">パスワード</label>
          <input
            name="password"
            type="password"
            className="w-full border p-2"
            required
          />
          {state.errors?.password?.map((err, i) => ( <p key={i} className="text-red-500 text-sm">{err}</p>))}
        </div>

        <div>
          <label className="block mb-1">パスワード（確認）</label>
          <input
            name="confirmPassword"
            type="password"
            className="w-full border p-2"
            required
          />
          {state.errors?.confirmPassword?.map((err, i) => ( <p key={i} className="text-red-500 text-sm">{err}</p>))}
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2">登録</button>
      </form>

      {state.errors?.server && (
        <p className="mt-4 text-green-600 text-sm">{state.errors.server}</p>
      )}
    </div>
  )
}