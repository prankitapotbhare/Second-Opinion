"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from "@/contexts/AuthContext";
import { useDoctor } from "@/contexts/DoctorContext";
import Header from "../dashboard/components/Header";
import Sidebar from "../dashboard/components/Sidebar";
import DashboardSection from "../dashboard/components/DashboardSection";
import AppointmentSection from "../dashboard/components/AppointmentSection";
import ProfileSection from "../dashboard/components/ProfileSection";
import SettingSection from "../dashboard/components/SettingSection";
import { FaUserMd, FaUsers, FaCalendarCheck, FaClock } from 'react-icons/fa';

export default function DoctorSectionPage() {
  const { currentUser } = useAuth();
  const { doctor } = useDoctor();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const params = useParams();
  const section = params?.section || 'dashboard';
  
  // Dashboard stats cards data
  const statCards = [
    { 
      title: "Today's Appointments", 
      count: 8, 
      icon: <FaCalendarCheck />,
      color: "blue"
    },
    { 
      title: "Pending Appointments", 
      count: 3, 
      icon: <FaClock />,
      color: "orange" 
    },
    { 
      title: "Total Patients", 
      count: 23, 
      icon: <FaUsers />,
      color: "green" 
    },
    { 
      title: "Completed Sessions", 
      count: 156, 
      icon: <FaUserMd />,
      color: "red" 
    }
  ];

  // Render content based on section parameter
  const renderContent = () => {
    switch (section) {
      case 'dashboard':
        return <DashboardSection />;
      case 'appointments':
        return <AppointmentSection />;
      case 'profile':
        return <ProfileSection />;
      case 'settings':
        return <SettingSection user={currentUser} doctor={doctor} />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 relative overflow-hidden">
      <Sidebar 
        activeTab={section} 
        handleTabClick={(tab) => window.location.href = `/doctor/${tab}`}
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        user={currentUser}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          setIsSidebarOpen={setIsSidebarOpen}
          title={section.charAt(0).toUpperCase() + section.slice(1)}
        />
        <div className="flex-1 overflow-y-auto pb-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}