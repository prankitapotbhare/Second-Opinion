"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { SplitScreen, AuthHeader } from '../../components';
import { LoginForm } from '../../components';

export default function DoctorLogin() {
  const router = useRouter();

  const handleSubmit = ({ email, password, rememberMe }) => {
    // Handle login logic here
    console.log({ email, password, rememberMe });
    
    // Redirect to doctor dashboard after successful login
    // router.push('/doctor/dashboard');
  };

  return (
    <SplitScreen 
      imageSrc="/images/Login/doctor-login.jpg" 
      imageAlt="Doctor with stethoscope"
      imagePosition="left"
      mobileImageHeight="30vh"
    >
      <div className="w-full max-w-md mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <AuthHeader 
          title="Doctor Login" 
          subtitle="Access your professional dashboard"
          align="left"
          titleClass="text-2xl sm:text-3xl font-bold text-gray-900"
          subtitleClass="text-sm sm:text-base text-gray-600 mt-2"
        />
        
        <div className="mt-6 sm:mt-8">
          <LoginForm 
            userType="doctor"
            onSubmit={handleSubmit}
            redirectPath="/doctor/dashboard"
          />
        </div>
      </div>
    </SplitScreen>
  );
}