"use client";

import React from 'react';
import { SplitScreen, AuthHeader } from '../../components';
import SignupForm from '../../components/forms/SignupForm';

export default function DoctorSignup() {
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
        redirectPath="/doctor/portal"
      />
    </SplitScreen>
  );
}