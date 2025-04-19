"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SplitScreen, AuthHeader } from '../../components';
import { LoginForm } from '../../components';

function  DoctorLoginContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/doctor/dashboard';

  return (
    <SplitScreen 
      imageSrc="/images/doctor.jpg" 
      imageAlt="Doctor with stethoscope"
      imagePosition="left"
      mobileImageHeight="30vh"
    >
      <AuthHeader 
        title="Welcome Back" 
        subtitle="Access your professional dashboard"
        align="left"
        titleClass="text-2xl sm:text-3xl font-bold text-gray-900"
        subtitleClass="text-sm sm:text-base text-gray-600 mt-2"
      />
        
      <LoginForm 
        userType="doctor"
        redirectPath={redirectTo}
      />
    </SplitScreen>
  );
}

// Main page component with Suspense boundary
export default function DoctorLogin() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <DoctorLoginContent />
    </Suspense>
  );
}