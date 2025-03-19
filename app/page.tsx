import React from 'react';
import AuthLogin from '../components/AuthLogin';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome</h1>
        <AuthLogin />
      </div>
    </main>
  );
} 