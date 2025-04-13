"use client";
import React, { useState } from "react";
import DashboardSection from "./components/DashboardSection";
import AppointmentSection from "./components/AppointmentSection";
import ProfileSection from "./components/ProfileSection";
import SettingSection from "./components/SettingSection";
import Header from "./components/Header";
import { FaChartLine, FaCalendarAlt, FaUserMd, FaCog, FaBars } from "react-icons/fa";
import { MdOutlineLogout, MdClose } from "react-icons/md";

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <div className="flex h-screen bg-[#E8F9FF] relative overflow-hidden">
      {/* Mobile Toggle Button */}
      {/* Mobile Toggle Button - only visible when sidebar is closed */}
      {!isSidebarOpen && (
        <div className="md:hidden absolute top-2 left-4 z-50 px-2 py-2">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-2xl text-gray-800 focus:outline-none"
          >
            <FaBars />
          </button>
        </div>
      )}


      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#D4EBF8] shadow-md transform transition-transform duration-300 z-40 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static md:block`}
      >
        <div className="p-3 flex justify-between items-center">

            <h1 className="lg:text-2xl sm:text-[15px] text-black font-bold">Second Opinion</h1>
            
          <div className="md:hidden ml-auto px-2 py-2">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-xl text-gray-800 focus:outline-none"
            >
              <MdClose style={{fontSize:"2rem"}} />
            </button>
          </div>
        </div>
          {/* Close Icon (mobile only) */}
        {/* Doctor Info - Sidebar, visible on mobile only */}
        <div className="px-6 pb-4">
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src="https://public.readdy.ai/ai/img_res/449f7f9cf87a2dac47b5084a82bbfdd1.jpg"
                    alt="Doctor"
                    className="w-10 h-10 rounded-full object-cover object-top"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="ml-3">
                  <div className="flex items-center">
                    <h2 className="text-lg font-medium text-gray-800">Dr. Jane Doe</h2>
                  </div>
                  <p className="text-sm text-gray-500">Cardiologist</p>
                </div>
              </div>
            </div>

        <nav className="mt-6">
          <ul>
            {[
              { id: "dashboard", label: "Dashboard", icon: <FaChartLine /> },
              { id: "appointments", label: "Appointments", icon: <FaCalendarAlt /> },
              { id: "profile", label: "Profile", icon: <FaUserMd /> },
              { id: "settings", label: "Settings", icon: <FaCog /> },
            ].map(({ id, label, icon }) => (
              <li
                key={id}
                className={`px-6 py-3 ${activeTab === id ? "bg-blue-50 border-l-4 border-blue-500" : ""
                  }`}
              >
                <button
                  onClick={() => handleTabClick(id)}
                  className={`flex items-center w-full text-left ${activeTab === id
                      ? "text-blue-600 font-medium"
                      : "text-gray-700"
                    } cursor-pointer whitespace-nowrap`}
                >
                  <span
                    className={`mr-3 ${activeTab === id ? "text-blue-600" : "text-gray-500"
                      }`}
                  >
                    {icon}
                  </span>
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 shadow-md p-4 flex justify-between items-center">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full flex items-center justify-center">
            <MdOutlineLogout className="inline-block mr-2" />
            Log out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        {activeTab === "dashboard" && <DashboardSection />}
        {activeTab === "appointments" && <AppointmentSection />}
        {activeTab === "profile" && <ProfileSection />}
        {activeTab === "settings" && <SettingSection />}
      </div>
    </div>
  );
};

export default DoctorDashboard;
