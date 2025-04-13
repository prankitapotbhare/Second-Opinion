"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AuthHeader, LoginForm } from '../../components';

export default function AdminLogin() {
  const router = useRouter();

  const handleSubmit = ({ email, password, rememberMe }) => {
    // Handle login logic here
    console.log({ email, password, rememberMe });
    
    // Redirect to admin dashboard after successful login
    // router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <AuthHeader 
          title="Admin Login" 
          subtitle="Access the administration panel"
          align="center"
        />
        
        <LoginForm 
          userType="admin"
          onSubmit={handleSubmit}
          redirectPath="/admin/dashboard"
        />
      </div>
    </div>
  );
}