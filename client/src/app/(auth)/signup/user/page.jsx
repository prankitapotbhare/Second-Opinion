"use client";

import React from 'react';
import { SplitScreen, AuthHeader } from '../../components';
import SignupForm from '../../components/forms/SignupForm';

export default function UserSignup() {
  return (
    <SplitScreen 
      imageSrc="/images/microscope.jpg" 
      imageAlt="user with healthcare provider"
      imagePosition="left"
    >
      <AuthHeader 
        title="Create Your Account" 
        subtitle="Join Second Opinion to get expert medical advice"
        align="left"
      />
      
      <SignupForm 
        userType="user"
        redirectPath="/"
      />
    </SplitScreen>
  );
}