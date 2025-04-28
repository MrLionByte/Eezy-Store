import { useEffect } from 'react';
import SignupForm from '../../../../components/auth/SignupForm';  

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">Eezy Store</h1>
          <p className="mt-2 text-gray-600">Create a new account</p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}