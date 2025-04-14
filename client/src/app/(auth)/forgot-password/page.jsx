"use client";

import React, { useState } from 'react';
import { AuthHeader, ForgotPasswordForm, StatusMessage } from '../components';

export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const handleSuccess = (email) => {
    setSubmittedEmail(email);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E8F9FF] p-4 sm:p-6 md:p-8">
        <StatusMessage
          status="success"
          title="Check Your Email"
          message={
            <>
              We've sent a password reset link to <span className="font-medium">{submittedEmail}</span>
            </>
          }
          alertContent={
            <p className="text-blue-800 text-sm">
              <i className="fas fa-info-circle mr-2"></i>
              If you don't see the email in your inbox, please check your spam folder.
            </p>
          }
          primaryButton={{
            text: "Return to Login",
            href: "/login"
          }}
          secondaryButton={{
            text: "Try Another Email",
            onClick: () => setIsSubmitted(false)
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E8F9FF] p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-4 sm:px-6 pt-6 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <AuthHeader 
            title="Forgot Password" 
            subtitle="Enter your email to receive a password reset link"
            align="center"
          />
        </div>
        
        <div className="p-4 sm:p-6">
          <ForgotPasswordForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}