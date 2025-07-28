import { config } from '../config'

export const login = async (email: string, password: string): Promise<string | null> => {
  const res = await fetch(`${config.apiUrl}/auth/login`, {
    method: 'POST',
    credentials: 'include', // Cookieを送信する
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (res.ok) {
    const data = await res.json()
    return data.accessToken
  }
  return null
}

export const refresh = async (): Promise<string | null> => {
  const res = await fetch(`${config.apiUrl}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })

  if (res.ok) {
    const data = await res.json()
    return data.accessToken
  }
  return null
}
