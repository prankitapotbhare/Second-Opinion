"use client";

import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import { FaBars } from 'react-icons/fa';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardContent from './components/dashboard/DashboardContent';
import DoctorsContent from './components/dashboard/DoctorsContent';
import PatientsContent from './components/dashboard/PatientsContent';
import AppointmentsContent from './components/dashboard/AppointmentsContent';
import SettingsContent from './components/dashboard/SettingsContent';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'doctors':
        return <DoctorsContent />;
      case 'patients':
        return <PatientsContent />;
      case 'appointments':
        return <AppointmentsContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f0f8ff]">
      {/* Mobile sidebar toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main content */}
      <ProtectedRoute allowedRoles={['admin']} redirectTo="/login/admin">
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </ProtectedRoute>
    </div>
  );
}