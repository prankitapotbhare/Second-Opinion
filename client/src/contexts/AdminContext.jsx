"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Create the admin context
const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const pathname = usePathname();

  // Set active tab based on current path
  useEffect(() => {
    const pathSegments = pathname.split('/');
    const section = pathSegments[pathSegments.length - 1];
    
    if (section && ['dashboard', 'doctors', 'patients', 'appointments', 'settings'].includes(section)) {
      setActiveTab(section);
    }
  }, [pathname]);

  const value = {
    isSidebarOpen,
    setIsSidebarOpen,
    activeTab,
    setActiveTab
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};