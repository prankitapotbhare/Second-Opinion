"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { SplitScreen, AuthHeader } from '../../components';
import { LoginForm } from '../../components';

export default function DoctorLogin() {
  const router = useRouter();

  const handleSubmit = (formData) => {
    // Handle login logic here
    console.log(formData);
    
    // Redirect to doctor dashboard after successful login
    // router.push('/doctor/dashboard');
  };

  return (
    <SplitScreen 
      imageSrc="/images/Login/doctor-login.jpg" 
      imageAlt="Doctor with telescope"
      imagePosition="left"
    >
      <AuthHeader 
        title="Doctor Login" 
        subtitle="Enter your credentials to access your account"
        align="left"
      />
      
      <LoginForm 
        userType="doctor"
        onSubmit={handleSubmit}
        redirectPath="/doctor/dashboard"
      />
    </SplitScreen>
  );
}