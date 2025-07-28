const getEnv = (key: string, required = true): string => {
  const value = process.env[key]
  if (required && !value) {
    throw new Error(`環境変数 ${key} が未設定です。`)
  }
  return value!
}

export const config = {
  apiUrl: getEnv('NEXT_PUBLIC_API_URL'), // フロントでも使う場合は NEXT_PUBLIC_ 必須
  nodeEnv: getEnv('NODE_ENV'),
}