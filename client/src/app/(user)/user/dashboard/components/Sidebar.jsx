"use client";
import React, { useState } from "react";
import { 
  FaTimes, 
  FaHome, 
  FaCalendarAlt, 
  FaUser, 
  FaCog, 
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaFileMedical
} from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

// Update the Sidebar component to use Next.js Link for navigation
const Sidebar = ({ 
  activeTab, 
  handleTabClick, 
  isSidebarOpen, 
  setIsSidebarOpen,
  user
}) => {
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const sidebarItems = [
    {
      name: "dashboard",
      label: "Dashboard",
      icon: <FaHome className="w-5 h-5" />,
    },
    {
      name: "appointments",
      label: "Appointments",
      icon: <FaCalendarAlt className="w-5 h-5" />,
    },
    {
      name: "medical-records",
      label: "Medical Records",
      icon: <FaFileMedical className="w-5 h-5" />,
    },
    {
      name: "profile",
      label: "My Profile",
      icon: <FaUser className="w-5 h-5" />,
    },
    {
      name: "settings",
      label: "Settings",
      icon: <FaCog className="w-5 h-5" />,
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="hidden md:flex fixed bottom-20 z-50 items-center justify-center w-8 h-8 bg-gradient-to-r from-teal-400 to-teal-300 text-white rounded-full shadow-lg hover:from-teal-500 hover:to-teal-400 transition-all duration-300 border border-teal-200"
        style={{ 
          left: isCollapsed ? '4rem' : '17rem',
          transform: 'translateY(-50%)'
        }}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <FaChevronRight size={14} /> : <FaChevronLeft size={14} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:relative md:flex transform transition-all duration-300 ease-in-out z-50 md:z-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className={`flex flex-col h-screen ${isCollapsed ? 'w-20' : 'w-72'} bg-gradient-to-br from-teal-100 via-teal-50 to-white text-teal-800 shadow-xl overflow-y-auto transition-all duration-300`}>
          {/* Sidebar Header with Enhanced Logo */}
          <div className={`mt-2 p-4 flex flex-col ${isCollapsed ? 'items-center' : ''}`}>
            <div className="flex items-center justify-between w-full">
              {!isCollapsed ? (
                <Link href="/" className="group">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-teal-500 rounded-md flex items-center justify-center mr-2 shadow-md border-2 border-teal-200">
                      <span className="text-white font-bold text-2xl">S</span>
                    </div>
                    <div>
                      <span className="text-teal-700 font-bold text-xl">Second</span>
                      <span className="text-teal-500 font-bold text-xl ml-1">Opinion</span>
                      <div className="h-0.5 w-0 group-hover:w-full bg-teal-400 transition-all duration-300 ease-in-out"></div>
                    </div>
                  </div>
                </Link>
              ) : (
                <Link href="/" className="mx-auto">
                  <div className="h-12 w-12 bg-teal-500 rounded-md flex items-center justify-center shadow-md border-2 border-teal-200">
                    <span className="text-white font-bold text-2xl">S</span>
                  </div>
                </Link>
              )}
              <button
                className="md:hidden text-teal-700 border border-teal-200 p-1 rounded-md hover:bg-teal-100"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className={`mt-6 flex ${isCollapsed ? 'flex-col items-center' : 'items-center'} border-y border-teal-200 py-6`}>
              <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-teal-400 border-2 border-teal-200">
                <img
                  src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&background=14b8a6&color=fff`}
                  alt="User"
                  className="w-full h-full object-cover"
                  width={48}
                  height={48}
                />
              </div>
              {!isCollapsed && (
                <div className="ml-3 overflow-hidden">
                  <p className="font-medium text-teal-800 truncate max-w-[180px]">
                    {user?.displayName || 'User'}
                  </p>
                  <p className="text-xs text-teal-500">Patient</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Menu */}
          <nav className="flex-1 px-2 pb-4 overflow-y-auto">
            <ul className="space-y-1 mt-2">
              {sidebarItems.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={`/user/${item.name}`}
                    className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === item.name
                        ? "bg-teal-400 text-white font-medium shadow-md"
                        : "text-teal-700 hover:bg-teal-200 hover:text-teal-800"
                    } ${isCollapsed ? 'justify-center' : ''}`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <span className={`inline-flex items-center justify-center ${isCollapsed ? 'w-6 h-6' : 'w-6 h-6 mr-3'}`}>
                      {item.icon}
                    </span>
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Redesigned Logout Button */}
          <div className="p-4 mt-auto border-t border-teal-200">
            <button 
              onClick={logout}
              className={`group flex items-center w-full px-4 py-3 text-gray-700 bg-white hover:bg-gray-100 rounded-lg transition-all duration-300 shadow-sm border border-teal-200 ${isCollapsed ? 'justify-center' : ''}`}
            >
              <span className="inline-flex items-center justify-center bg-gradient-to-r from-orange-400 to-red-400 p-1.5 rounded-full text-white">
                <FaSignOutAlt className={`${isCollapsed ? '' : ''}`} size={16} />
              </span>
              {!isCollapsed && <span className="font-medium ml-3 group-hover:text-gray-900">Sign Out</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;