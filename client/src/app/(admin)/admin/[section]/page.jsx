"use client";

import React, { useState } from 'react';
import { 
  DashboardContent,
  DoctorsContent,
  PatientsContent,
  AppointmentsContent,
  SettingsContent
} from '@/app/(admin)/components';

export default function AdminSectionPage({ params }) {
  const { section } = params;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Render content based on section parameter
  const renderContent = () => {
    switch (section) {
      case 'dashboard':
        return <DashboardContent setIsSidebarOpen={setIsSidebarOpen} />;
      case 'doctors':
        return <DoctorsContent setIsSidebarOpen={setIsSidebarOpen} />;
      case 'patients':
        return <PatientsContent setIsSidebarOpen={setIsSidebarOpen} />;
      case 'appointments':
        return <AppointmentsContent setIsSidebarOpen={setIsSidebarOpen} />;
      case 'settings':
        return <SettingsContent setIsSidebarOpen={setIsSidebarOpen} />;
      default:
        return <DashboardContent setIsSidebarOpen={setIsSidebarOpen} />;
    }
  };

  return renderContent();
}