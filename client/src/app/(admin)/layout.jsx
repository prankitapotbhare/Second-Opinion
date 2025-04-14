"use client";

import React, { useState } from 'react';
import { Sidebar } from './components';
import { FaBars } from 'react-icons/fa';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardContent from './components/dashboard/DashboardContent';
import DoctorsContent from './components/doctor/DoctorsContent';
import PatientsContent from './components/patient/PatientsContent';
import AppointmentsContent from './components/appointments/AppointmentsContent';
import SettingsContent from './components/settings/SettingsContent';
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { currentUser } = useAuth();

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
    <div className="flex h-screen bg-[#f0f8ff] overflow-hidden">
      {/* Mobile sidebar toggle - only show when sidebar is closed */}
      {!isSidebarOpen && (
        <button 
          className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
          onClick={() => setIsSidebarOpen(true)}
        >
          <FaBars />
        </button>
      )}

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