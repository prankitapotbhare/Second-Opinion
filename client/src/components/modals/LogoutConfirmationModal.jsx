import React from 'react';

const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-sm border border-gray-200">
        {/* Message */}
        <p className="text-center text-lg font-medium text-gray-700 mb-6">
          Are you sure to log-out?
        </p>

        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            log-out
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;