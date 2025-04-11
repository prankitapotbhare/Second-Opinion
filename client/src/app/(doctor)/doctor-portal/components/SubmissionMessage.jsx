"use client";

import React, { useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const SubmissionMessage = ({ 
  show, 
  type = 'success', 
  message, 
  onClose,
  autoClose = true,
  autoCloseTime = 5000,
  redirectPath = null
}) => {
  const router = useRouter();

  useEffect(() => {
    // Handle auto-close with redirect
    if (show && autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseTime);
      
      return () => clearTimeout(timer);
    }
  }, [show, autoClose, autoCloseTime]);

  const handleClose = () => {
    if (onClose) onClose();
    
    // If redirectPath is provided, navigate to that path
    if (redirectPath) {
        router.push(redirectPath);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(0,0,0,0.7)]">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 animate-fade-in-up">
        <div className="flex items-center justify-center mb-4">
          {type === 'success' ? (
            <FaCheckCircle className="text-green-500 text-5xl" />
          ) : (
            <FaTimesCircle className="text-red-500 text-5xl" />
          )}
        </div>
        <h3 className="text-xl font-semibold text-center mb-2">
          {type === 'success' ? 'Success!' : 'Error!'}
        </h3>
        <p className="text-gray-600 text-center mb-6">{message}</p>
        <div className="flex justify-center">
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            {redirectPath ? 'Continue to Dashboard' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionMessage;