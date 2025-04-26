import { useEffect } from 'react';
import LoginForm from '../../components/auth/LoginForm';

export default function AdminLoginPage() {
  useEffect(() => {
    document.title = 'Admin Login | Eezy Store';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">Eezy Store Admin</h1>
          <p className="mt-2 text-gray-600">Login to admin panel</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}