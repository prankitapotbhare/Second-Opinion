"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from "@/contexts/AuthContext";
import Header from "../dashboard/components/Header";
import Sidebar from "../dashboard/components/Sidebar";
import DashboardSection from "../dashboard/components/DashboardSection";
import AppointmentsSection from "../dashboard/components/AppointmentsSection";
import ProfileSection from "../dashboard/components/ProfileSection";
import SettingsSection from "../dashboard/components/SettingsSection";
import MedicalRecordsSection from "../dashboard/components/MedicalRecordsSection";
import { FaUserAlt, FaCalendarCheck, FaClipboardList, FaCommentMedical } from 'react-icons/fa';

export default function UserSectionPage() {
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const params = useParams();
  const section = params?.section || 'dashboard';
  
  // Dashboard stats cards data
  const statCards = [
    { 
      title: "Upcoming Appointments", 
      count: 3, 
      icon: <FaCalendarCheck />,
      color: "blue"
    },
    { 
      title: "Completed Consultations", 
      count: 8, 
      icon: <FaClipboardList />,
      color: "green" 
    },
    { 
      title: "Medical Reports", 
      count: 5, 
      icon: <FaClipboardList />,
      color: "orange" 
    },
    { 
      title: "Messages", 
      count: 2, 
      icon: <FaCommentMedical />,
      color: "purple" 
    }
  ];

  // Render content based on section parameter
  const renderContent = () => {
    switch (section) {
      case 'dashboard':
        return <DashboardSection statCards={statCards} />;
      case 'appointments':
        return <AppointmentsSection />;
      case 'medical-records':
        return <MedicalRecordsSection user={currentUser} />;
      case 'profile':
        return <ProfileSection user={currentUser} />;
      case 'settings':
        return <SettingsSection user={currentUser} />;
      default:
        return <DashboardSection statCards={statCards} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#E8F9FF] relative overflow-hidden">
      <Sidebar 
        activeTab={section} 
        handleTabClick={(tab) => window.location.href = `/user/${tab}`}
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        user={currentUser}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          user={currentUser} 
          setIsSidebarOpen={setIsSidebarOpen}
          title={section}
        />
        <div className="flex-1 overflow-y-auto pb-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}