"use client";

import React from 'react';
import { FaUserAlt, FaUserMd } from 'react-icons/fa';
import { AccountSelector } from '../components';

export default function SignupSelector() {
  const signupOptions = [
    {
      title: "Sign Up as User",
      description: "Get expert medical opinions and manage your health records",
      icon: <FaUserAlt className="h-5 w-5 text-blue-600" />,
      href: "/signup/user",
      color: "blue"
    },
    {
      title: "Sign Up as Doctor",
      description: "Provide your expertise and help patients with second opinions",
      icon: <FaUserMd className="h-5 w-5 text-green-600" />,
      href: "/signup/doctor",
      color: "green"
    }
  ];

  return (
    <AccountSelector
      title="Create an Account"
      subtitle="Choose how you want to join Second Opinion"
      options={signupOptions}
      footerText="Already have an account?"
      footerLinkText="Sign In"
      footerLinkHref="/login"
    />
  );
}