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
      imageAlt="user with doctor"
      imagePosition="right"
    >
      <AuthHeader 
        title="User Login" 
        subtitle="Access your healthcare account"
        align="center"
      />
      
      <LoginForm 
        userType="user"
        onSubmit={handleSubmit}
        redirectPath="/user/dashboard"
      />
    </SplitScreen>
  );
}