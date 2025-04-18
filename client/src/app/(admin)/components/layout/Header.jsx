"use client";

import React from 'react';
import { FaBars } from 'react-icons/fa';
import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';

const Header = ({ title }) => {
  const { setIsSidebarOpen } = useAdmin();
  const { currentUser } = useAuth();
  
  return (
    <div className="bg-white shadow-sm sticky top-0 z-30 mb-6">
      <div className="flex items-center justify-between max-w-[1440px] mx-auto px-6 py-4">
        <div className="flex items-center gap-4">
          <button 
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 md:hidden transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FaBars />
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">{title}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Profile Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-100 shadow-sm">
              <img
                src={currentUser?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.displayName || 'Admin')}&background=3b82f6&color=fff`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden md:block text-left">
              <p className="font-medium text-gray-800">{currentUser?.displayName || "Administrator"}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;