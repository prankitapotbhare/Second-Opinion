"use client";

import React from 'react';
import Link from 'next/link';

const EmailVerificationStatus = ({ 
  email, 
  isVerified = false,
  onResendVerification,
  isResending = false
}) => {
  return (
    <div className={`rounded-md p-4 mb-6 ${isVerified ? 'bg-green-50' : 'bg-yellow-50'}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {isVerified ? (
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${isVerified ? 'text-green-800' : 'text-yellow-800'}`}>
            {isVerified ? 'Email Verified' : 'Email Verification Required'}
          </h3>
          <div className={`mt-2 text-sm ${isVerified ? 'text-green-700' : 'text-yellow-700'}`}>
            {isVerified ? (
              <p>Your email address ({email}) has been verified.</p>
            ) : (
              <div>
                <p>Please verify your email address ({email}) to access all features.</p>
                <div className="mt-2">
                  <button
                    onClick={onResendVerification}
                    disabled={isResending}
                    className="text-sm font-medium text-yellow-800 hover:text-yellow-900 disabled:opacity-50"
                  >
                    {isResending ? 'Sending...' : 'Resend verification email'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationStatus;