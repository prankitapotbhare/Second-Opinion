"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PasswordInput } from '../../components';
import { validatePassword } from '@/utils/authUtils';
import { useAuth } from '@/contexts/AuthContext';

const ResetPasswordForm = ({ token }) => {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [passwordValidation, setPasswordValidation] = useState({ isValid: true, message: '' });

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    // Validate password as user types
    if (newPassword) {
      const validation = validatePassword(newPassword);
      setPasswordValidation(validation);
    } else {
      setPasswordValidation({ isValid: true, message: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate password
    if (!password) {
      setError('Password is required');
      return;
    }
    
    // Check password validation
    const validation = validatePassword(password);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await resetPassword(token, password);
      
      if (result.success) {
        // Redirect to login with success message
        router.push(`/login?message=${encodeURIComponent('Password reset successful. You can now log in with your new password.')}`);
      } else {
        setError(result.error || 'Failed to reset password');
        setIsSubmitting(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setIsSubmitting(false);
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <PasswordInput
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Create a new password"
            label="New Password"
          />
          
          {password && !passwordValidation.isValid && (
            <p className="mt-1 text-sm text-red-600">
              {passwordValidation.message}
            </p>
          )}
        </div>
        
        <div>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
            label="Confirm Password"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;