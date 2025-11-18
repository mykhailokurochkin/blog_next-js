import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import AuthFormClient from './AuthFormClient';

export default async function AuthPage() {
  const session = await getServerSession();
  
  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <AuthFormClient />
      </div>
    </main>
  );
}
