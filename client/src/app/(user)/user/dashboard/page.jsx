"use client";

import React, { useState } from "react";
import { UserSidebar } from "@/components";
import UserHeader from "@/components/layout/UserHeader";
import DashboardSection from "./components/DashboardSection";
import AppointmentsSection from "./components/AppointmentsSection";
import ProfileSection from "./components/ProfileSection";
import SettingsSection from "./components/SettingsSection";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <div className="flex h-screen bg-[#E8F9FF] relative overflow-hidden">
      <UserSidebar 
        activeTab={activeTab} 
        handleTabClick={handleTabClick} 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <UserHeader />
        {activeTab === "dashboard" && <DashboardSection />}
        {activeTab === "appointments" && <AppointmentsSection />}
        {activeTab === "profile" && <ProfileSection />}
        {activeTab === "settings" && <SettingsSection />}
      </div>
    </div>
  );
};

export default UserDashboard;