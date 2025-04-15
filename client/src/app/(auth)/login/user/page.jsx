"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SplitScreen, AuthHeader, LoginForm } from '../../components';

export default function UserLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const handleSubmit = ({ email, password, rememberMe }) => {
    // Handle login logic here
    console.log({ email, password, rememberMe });
    
    // Redirect to home page or the requested page after successful login
    router.push(redirectTo);
  };

  return (
    <SplitScreen 
      imageSrc="/images/Login/doctor-login.jpg" 
      imageAlt="User with doctor"
      imagePosition="right"
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
        onSubmit={handleSubmit}
        redirectPath={redirectTo}
      />
    </SplitScreen>
  );
}