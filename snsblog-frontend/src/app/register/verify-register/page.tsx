import { verifyRegisterServer } from '@/app/actions/verifyRegister-action';
import Link from 'next/link'; 

export default async function VerifyRegisterPage({ searchParams }: {
  searchParams: { token?: string }
}) {
  const result = await verifyRegisterServer(searchParams.token ?? null);

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded text-center">
      <p className={result.success ? 'text-green-600' : 'text-red-600'}>
        {result.message}
      </p>

      {result.success && (
        <Link
          href={`/register/register-profile?token=${searchParams.token}`}
          className="inline-block mt-6 text-blue-600 underline"
        >
          プロフィール登録へ
        </Link>
      )}
    </div>
  );
}