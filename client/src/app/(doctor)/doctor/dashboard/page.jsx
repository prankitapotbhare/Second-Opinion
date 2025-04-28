"use client";
import React, { useState } from "react";
import { FaUserMd, FaUsers, FaCalendarCheck, FaClock } from 'react-icons/fa';
import DashboardSection from "./components/DashboardSection";
import AppointmentSection from "./components/AppointmentSection";
import ProfileSection from "./components/ProfileSection";
import SettingSection from "./components/SettingSection";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useDoctor } from "@/contexts/DoctorContext";

const DoctorDashboard = () => {
  const { currentUser } = useAuth();
  const { doctor } = useDoctor();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

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

  return (
    <div className="flex h-screen bg-gray-50 relative overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        handleTabClick={handleTabClick} 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        user={currentUser}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          setIsSidebarOpen={setIsSidebarOpen}
          title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        />
        <div className="flex-1 overflow-y-auto pb-6">
          {activeTab === "dashboard" && <DashboardSection statCards={statCards} />}
          {activeTab === "appointments" && <AppointmentSection />}
          {activeTab === "profile" && <ProfileSection />}
          {activeTab === "settings" && <SettingSection user={currentUser} doctor={doctor} />}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
