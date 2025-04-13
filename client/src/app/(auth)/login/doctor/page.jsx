"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { SplitScreen, AuthHeader } from '../../components';
import SignupForm from '../../components/forms/LoginForm';

export default function DoctorSignup() {
  const router = useRouter();

  const handleSubmit = (formData) => {
    // Handle signup logic here
    console.log(formData);
    
    // Redirect to doctor onboarding after successful signup
    // router.push('/doctor/dashboard');
  };

  return (
    <SplitScreen 
      imageSrc="/images/Login/doctor-login.jpg" 
      imageAlt="Doctor with telescope"
      imagePosition="left"
    >
      <AuthHeader 
        title="Welcome" 
        subtitle="Enter your Email and Password to Login"
        align="left"
      />
      
      <SignupForm 
        userType="doctor"
        onSubmit={handleSubmit}
        redirectPath="/doctor/dashboard"
      />
    </SplitScreen>
  );
}