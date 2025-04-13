"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import PasswordInput from '../common/PasswordInput';
import SocialLoginButton from '../common/SocialLoginButton';
import AuthDivider from '../common/AuthDivider';

const SignupForm = ({ 
  userType = 'user', // 'user', 'doctor', or 'admin'
  onSubmit,
  redirectPath = '/'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const handleGoogleSignup = () => {
    // Handle Google signup
    console.log('Google signup clicked');
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your email"
            required
          />
        </div>

        <PasswordInput 
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        <PasswordInput 
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
        />

        <div className="flex items-center">
          <input
            id="agreeToTerms"
            name="agreeToTerms"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            required
          />
          <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
            I agree to the <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">Terms of Service</Link> and <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</Link>
          </label>
        </div>

        <div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 cursor-pointer"
          >
            Create Account
          </button>
        </div>

        <AuthDivider text="or sign up with" />

        <div>
          <SocialLoginButton 
            provider="Google" 
            onClick={handleGoogleSignup} 
          />
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href={`/login/${userType}`} className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign In
        </Link>
      </p>
    </>
  );
};

export default SignupForm;