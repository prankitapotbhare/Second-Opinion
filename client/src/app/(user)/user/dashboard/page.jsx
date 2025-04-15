"use client";
import React, { useState } from "react";
import { FaUserAlt, FaCalendarCheck, FaClipboardList, FaCommentMedical } from 'react-icons/fa';
import DashboardSection from "./components/DashboardSection";
import AppointmentsSection from "./components/AppointmentsSection";
import ProfileSection from "./components/ProfileSection";
import SettingsSection from "./components/SettingsSection";
import MedicalRecordsSection from "./components/MedicalRecordsSection";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

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

  return (
    <div className="flex h-screen bg-[#E8F9FF] relative overflow-hidden">
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
          user={currentUser} 
          setIsSidebarOpen={setIsSidebarOpen}
          title={activeTab}
        />
        <div className="flex-1 overflow-y-auto pb-6">
          {activeTab === "dashboard" && <DashboardSection statCards={statCards} />}
          {activeTab === "appointments" && <AppointmentsSection />}
          {activeTab === "medical-records" && <MedicalRecordsSection user={currentUser} />}
          {activeTab === "profile" && <ProfileSection user={currentUser} />}
          {activeTab === "settings" && <SettingsSection user={currentUser} />}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;