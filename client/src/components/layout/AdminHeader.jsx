"use client";

import React from 'react';
import { FaBars } from 'react-icons/fa';

const AdminHeader = ({ title, setIsSidebarOpen }) => {
  return (
    <div className="flex items-center justify-between max-w-[1440px] mx-auto p-6">
      <div className="flex-1 md:hidden">
        <button 
          className="p-2 rounded-md"
          onClick={() => setIsSidebarOpen(true)}
        >
          <FaBars />
        </button>
      </div>
      <h1 className="text-2xl font-bold flex-1 text-center">{title}</h1>
      <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20male%20indian%20doctor%20wearing%20a%20white%20coat%20against%20a%20neutral%20background%2C%20high%20quality%20professional%20corporate%20photo&width=100&height=100&seq=1&orientation=squarish"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-medium">Uma Shankar (Admin)</span>
      </div>
    </div>
  );
};

export default AdminHeader;