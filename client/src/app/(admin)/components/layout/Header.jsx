"use client";

import React from 'react';
import { FaBars } from 'react-icons/fa';

const Header = ({ title, setIsSidebarOpen }) => {
  return (
    <div className="bg-white shadow-sm sticky top-0 z-30 mb-6">
      <div className="flex items-center justify-between max-w-[1440px] mx-auto p-4">
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
                src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20male%20indian%20doctor%20wearing%20a%20white%20coat%20against%20a%20neutral%20background%2C%20high%20quality%20professional%20corporate%20photo&width=100&height=100&seq=1&orientation=squarish"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden md:block text-left">
              <p className="font-medium text-gray-800">Uma Shankar</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;