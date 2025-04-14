"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { SplitScreen, AuthHeader, LoginForm } from '../../components';

export default function UserLogin() {
  const router = useRouter();

  const handleSubmit = ({ email, password, rememberMe }) => {
    // Handle login logic here
    console.log({ email, password, rememberMe });
    
    // Redirect to user dashboard after successful login
    // router.push('/user/dashboard');
  };

  return (
    <SplitScreen 
      imageSrc="/images/Login/user-login.jpg" 
      imageAlt="User with doctor"
      imagePosition="right"
      mobileImageHeight="30vh"
    >
      <div className="w-full max-w-md mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <AuthHeader 
          title="User Login" 
          subtitle="Access your healthcare account"
          align="left"
          titleClass="text-2xl sm:text-3xl font-bold text-gray-900"
          subtitleClass="text-sm sm:text-base text-gray-600 mt-2"
        />
        
        <div className="mt-6 sm:mt-8">
          <LoginForm 
            userType="user"
            onSubmit={handleSubmit}
            redirectPath="/user/dashboard"
          />
        </div>
      </div>
    </SplitScreen>
  );
}