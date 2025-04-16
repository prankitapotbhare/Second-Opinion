"use client";

import React from 'react';
import { SplitScreen, AuthHeader } from '../../components';
import { LoginForm } from '../../components';

export default function DoctorLogin() {
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
        redirectPath="/doctor/dashboard"
      />
    </SplitScreen>
  );
}