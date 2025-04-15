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
    
    // Redirect to home page after successful signup
    router.push('/');
  };

  return (
    <SplitScreen 
      imageSrc="/images/SignUp/doctor-signup.jpg" 
      imageAlt="user with healthcare provider"
      imagePosition="right"
    >
      <AuthHeader 
        title="Create Your Account" 
        subtitle="Join Second Opinion to get expert medical advice"
        align="left"
      />
      
      <SignupForm 
        userType="user"
        onSubmit={handleSubmit}
        redirectPath="/"
      />
    </SplitScreen>
  );
}