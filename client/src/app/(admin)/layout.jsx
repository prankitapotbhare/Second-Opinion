"use client";

import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { AdminSidebar } from '@/components';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f0f8ff]">
      {/* Mobile sidebar toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}