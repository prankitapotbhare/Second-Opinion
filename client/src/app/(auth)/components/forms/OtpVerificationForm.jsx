"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const OtpVerificationForm = ({ 
  email, 
  redirectPath = '/',
  onSuccess = null,
  onResendSuccess = null
}) => {
  const router = useRouter();
  const { verifyEmail, resendVerification } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  
  const inputRefs = useRef([]);
  
  // Set up countdown timer for resend button
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);
  
  // Handle OTP input change
  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };
  
  // Handle key press for backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input on backspace if current input is empty
      inputRefs.current[index - 1].focus();
    }
  };
  
  // Handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      
      // Focus the last input
      inputRefs.current[5].focus();
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Check if OTP is complete
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit verification code');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await verifyEmail(email, otpValue);
      
      if (result.success) {
        if (onSuccess) {
          onSuccess(result);
        } else {
          // Redirect to the specified path
          router.push(redirectPath);
        }
      } else {
        setError(result.error || 'Invalid verification code. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setIsSubmitting(false);
      console.error(err);
    }
  };
  
  // Handle resend verification
  const handleResendVerification = async () => {
    if (resendCountdown > 0) return;
    
    setIsResending(true);
    setError('');
    setResendSuccess(false);
    
    try {
      const result = await resendVerification(email);
      
      if (result.success) {
        setResendSuccess(true);
        setResendCountdown(60); // Set 60 second countdown
        
        if (onResendSuccess) {
          onResendSuccess();
        }
      } else {
        setError(result.error || 'Failed to resend verification code');
      }
    } catch (err) {
      setError('An unexpected error occurred while resending verification code');
      console.error(err);
    } finally {
      setIsResending(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600">
          We've sent a verification code to <span className="font-medium">{email}</span>
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {resendSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-3 py-2 rounded-md text-sm">
          Verification code resent successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
            Enter the 6-digit verification code
          </label>
          
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>
      
      <div className="text-center">
        <button
          type="button"
          onClick={handleResendVerification}
          disabled={isResending || resendCountdown > 0}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isResending ? 'Sending...' : 
           resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : 
           'Resend verification code'}
        </button>
      </div>
    </div>
  );
};

export default OtpVerificationForm;