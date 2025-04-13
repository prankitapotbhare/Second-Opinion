"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { SplitScreen, AuthHeader } from '../../components';
import SignupForm from '../../components/forms/SignupForm';

export default function UserSignup() {
  const router = useRouter();

  const handleSubmit = (formData) => {
    // Handle signup logic here
    console.log(formData);
    
    // Redirect to user dashboard after successful signup
    // router.push('/user/dashboard');
  };

  return (
    <SplitScreen 
      imageSrc="/images/SignUp/user-signup.jpg" 
      imageAlt="user with healthcare provider"
      imagePosition="right"
    >
      <AuthHeader 
        title="Create Your user Account" 
        subtitle="Join Second Opinion to get expert medical advice"
        align="center"
      />
      
      <SignupForm 
        userType="user"
        onSubmit={handleSubmit}
        redirectPath="/user/dashboard"
      />
    </SplitScreen>
  );
}