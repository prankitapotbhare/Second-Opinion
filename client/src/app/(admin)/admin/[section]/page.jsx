"use client";

import React from 'react';
import { 
  DashboardContent,
  DoctorsContent,
  PatientsContent,
  AppointmentsContent,
  SettingsContent
} from '@/app/(admin)/components';
import { useParams } from 'next/navigation';

export default function AdminSectionPage() {
  // Use useParams hook instead of React.use
  const params = useParams();
  const section = params?.section || 'dashboard';
  
  // Render content based on section parameter
  const renderContent = () => {
    switch (section) {
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

  return renderContent();
}