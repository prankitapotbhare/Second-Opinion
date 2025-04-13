"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './components/layout/Sidebar';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { currentUser, loading, hasRole } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check authentication and role
  React.useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.push('/login/admin');
      } else if (!hasRole('admin')) {
        // If user is logged in but not an admin, redirect to their appropriate dashboard
        router.push(`/${currentUser.role}/dashboard`);
      }
    }
  }, [currentUser, loading, router, hasRole]);

  // Show loading state while checking authentication
  if (loading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

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
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}