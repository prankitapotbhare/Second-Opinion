"use client";

import React from 'react';
import { 
  DashboardContent,
  DoctorsContent,
  PatientsContent,
  AppointmentsContent,
  SettingsContent
} from '@/app/(admin)/components';

export default function AdminSectionPage({ params }) {
  // Unwrap params with React.use()
  const unwrappedParams = React.use(params);
  const { section } = unwrappedParams;
  
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