"use client";
import React from "react";
import { FaChartLine, FaCalendarAlt, FaUserMd, FaCog, FaBars } from "react-icons/fa";
import { MdOutlineLogout, MdClose } from "react-icons/md";
import { useAuth } from "@/contexts/AuthContext";

const Sidebar = ({ activeTab, handleTabClick, isSidebarOpen, setIsSidebarOpen, user }) => {
  const { logout } = useAuth();
  
  return (
    <>
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
        className={`fixed top-0 left-0 h-full w-64 bg-[#D4EBF8] shadow-md transform transition-transform duration-300 z-40 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
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
        
        {/* Doctor Info */}
        <div className="px-6 pb-4">
          <div className="flex items-center">
            <div className="relative">
              <img
                src={user?.avatar || "https://public.readdy.ai/ai/img_res/449f7f9cf87a2dac47b5084a82bbfdd1.jpg"}
                alt="Doctor"
                className="w-10 h-10 rounded-full object-cover object-top"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800">{user?.name || "Dr. John Smith"}</p>
              <p className="text-xs text-gray-500">{user?.specialization || "Cardiologist"}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-2">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => handleTabClick("dashboard")}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                  activeTab === "dashboard"
                    ? "bg-[#0F4C75] text-white"
                    : "text-gray-700 hover:bg-[#BBE1FA] hover:text-gray-900"
                }`}
              >
                <FaChartLine className="mr-3" />
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabClick("appointments")}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                  activeTab === "appointments"
                    ? "bg-[#0F4C75] text-white"
                    : "text-gray-700 hover:bg-[#BBE1FA] hover:text-gray-900"
                }`}
              >
                <FaCalendarAlt className="mr-3" />
                Appointments
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabClick("profile")}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                  activeTab === "profile"
                    ? "bg-[#0F4C75] text-white"
                    : "text-gray-700 hover:bg-[#BBE1FA] hover:text-gray-900"
                }`}
              >
                <FaUserMd className="mr-3" />
                Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabClick("settings")}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                  activeTab === "settings"
                    ? "bg-[#0F4C75] text-white"
                    : "text-gray-700 hover:bg-[#BBE1FA] hover:text-gray-900"
                }`}
              >
                <FaCog className="mr-3" />
                Settings
              </button>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button 
            onClick={logout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
          >
            <MdOutlineLogout className="mr-3" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;