'use server';
import { config } from '@/lib/config';

export async function verifyRegisterServer(token: string | null) {
  if (!token) {
    return { success: false, message: 'トークンが無効です。' };
  }

  try {
    const res = await fetch(
      `${config.apiUrl}/auth/verify-register?token=${token}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // SSRで動的にするため
      }
    );

    if (!res.ok) {
      return { success: false, message: '認証に失敗しました。URLが無効または期限切れです。' };
    }

    const data = await res.json();
    return { success: true, message: data.message || '本登録が完了しました。' };
  } catch (error) {
    return { success: false, message: 'サーバーエラーが発生しました。' };
  }
}