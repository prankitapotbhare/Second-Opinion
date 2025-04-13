"use client";
import React, { useState } from "react";
import DashboardSection from "./components/DashboardSection";
import AppointmentSection from "./components/AppointmentSection";
import ProfileSection from "./components/ProfileSection";
import SettingSection from "./components/SettingSection";
import Header from "./components/Header";
import { DoctorSidebar } from "@/components";
import { useAuth } from "@/contexts/AuthContext";

const DoctorDashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <div className="flex h-screen bg-[#E8F9FF] relative overflow-hidden">
      <DoctorSidebar 
        activeTab={activeTab} 
        handleTabClick={handleTabClick} 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        user={currentUser}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={currentUser} />
        {activeTab === "dashboard" && <DashboardSection />}
        {activeTab === "appointments" && <AppointmentSection />}
        {activeTab === "profile" && <ProfileSection user={currentUser} />}
        {activeTab === "settings" && <SettingSection user={currentUser} />}
      </div>
    </div>
  );
};

export default DoctorDashboard;
