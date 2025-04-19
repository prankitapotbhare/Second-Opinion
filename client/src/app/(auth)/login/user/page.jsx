"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SplitScreen, AuthHeader, LoginForm } from '../../components';

// Create a client component that uses useSearchParams
function UserLoginContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  return (
    <SplitScreen 
      imageSrc="/images/microscope.jpg" 
      imageAlt="User with doctor"
      imagePosition="left"
      mobileImageHeight="30vh"
    >
      <AuthHeader 
        title="Welcome Back" 
        subtitle="Sign in to your patient account"
        align="left"
        titleClass="text-2xl sm:text-3xl font-bold text-gray-900"
        subtitleClass="text-sm sm:text-base text-gray-600 mt-2"
      />
      
      <LoginForm 
        userType="user"
        redirectPath={redirectTo}
      />
    </SplitScreen>
  );
}

// Main page component with Suspense boundary
export default function UserLogin() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <UserLoginContent />
    </Suspense>
  );
}