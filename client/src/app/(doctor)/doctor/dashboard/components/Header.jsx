"use client";

import React from 'react';
import { FaBars, FaBell } from 'react-icons/fa';

const Header = ({ setIsSidebarOpen, title = "Dashboard" }) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
    
  return (
    <div className="bg-white shadow-sm sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        <div className="flex items-center gap-4">
          <button 
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 md:hidden transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FaBars />
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 bg-gray-600 bg-clip-text">{title}</h1>
        </div>
        
        <div className="flex items-center">
          <div className="mr-6 text-sm text-gray-500">
            <span className="hidden sm:inline">{formattedDate}</span>
            <span className="hidden sm:inline sm:mx-2">|</span>
            <span>{formattedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;