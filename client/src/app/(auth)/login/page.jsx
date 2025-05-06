"use client";

import React from 'react';
import { FaUserAlt, FaUserMd, FaUserCog } from 'react-icons/fa';
import { AccountSelector } from '../components';

export default function LoginSelector() {
  const loginOptions = [
    {
      title: "User Login",
      description: "Access your healthcare account",
      icon: <FaUserAlt className="h-5 w-5 text-blue-600" />,
      href: "/login/patient",
      color: "blue"
    },
    {
      title: "Doctor Login",
      description: "Access your professional dashboard",
      icon: <FaUserMd className="h-5 w-5 text-green-600" />,
      href: "/login/doctor",
      color: "green"
    },
    {
      title: "Admin Login",
      description: "Access the administration panel",
      icon: <FaUserCog className="h-5 w-5 text-purple-600" />,
      href: "/login/admin",
      color: "purple"
    }
  ];

  return (
    <AccountSelector
      title="Welcome Back"
      subtitle="Choose your account type to continue"
      options={loginOptions}
      footerText="Don't have an account?"
      footerLinkText="Sign Up"
      footerLinkHref="/signup"
    />
  );
}