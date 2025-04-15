"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { SplitScreen, AuthHeader } from '../../components';
import SignupForm from '../../components/forms/SignupForm';

export default function DoctorSignup() {
  const router = useRouter();

  const handleSubmit = (formData) => {
    // Handle signup logic here
    console.log(formData);
    
    // Redirect to doctor portal after successful signup
    router.push('/doctor/portal');
  };

  return (
    <SplitScreen 
      imageSrc="/images/doctor.jpg" 
      imageAlt="Microscope"
      imagePosition="left"
    >
      <AuthHeader 
        title="Join as a Doctor" 
        subtitle="Create your account to provide medical expertise"
        align="left"
      />
      
      <SignupForm 
        userType="doctor"
        onSubmit={handleSubmit}
        redirectPath="/doctor/portal"
      />
    </SplitScreen>
  );
}