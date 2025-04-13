"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import PasswordInput from '../common/PasswordInput';
import SocialLoginButton from '../common/SocialLoginButton';
import AuthDivider from '../common/AuthDivider';

const LoginForm = ({ 
  userType = 'user', // 'user', 'doctor', or 'admin'
  onSubmit,
  redirectPath = '/'
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ email, password, rememberMe });
    }
  };

  const handleGoogleLogin = () => {
    // Handle Google login
    console.log('Google login clicked');
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your email"
            required
          />
        </div>

        <PasswordInput 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">
            Forgot Password
          </Link>
        </div>

        <div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 cursor-pointer"
          >
            Sign In
          </button>
        </div>

        <AuthDivider text="or sign in with" />

        <div>
          <SocialLoginButton 
            provider="Google" 
            onClick={handleGoogleLogin} 
          />
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link href={`/signup/${userType}`} className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign Up
        </Link>
      </p>
    </>
  );
};

export default LoginForm;