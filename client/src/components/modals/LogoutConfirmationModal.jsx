import React from 'react';

const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    // Backdrop with blur effect
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-sm border border-gray-200">
        {/* Title */}
        <h3 className="text-center text-xl font-semibold text-gray-800 mb-2">
          Confirm Logout
        </h3>
        
        {/* Message */}
        <p className="text-center text-gray-600 mb-8">
          Are you sure you want to log out of your account?
        </p>

        {/* Buttons - using teal color scheme from Navbar */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 bg-teal-700 text-white rounded-md hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;