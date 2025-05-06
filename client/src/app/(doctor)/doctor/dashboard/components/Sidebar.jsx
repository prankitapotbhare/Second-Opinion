"use client";
import React, { useState } from "react";
import { 
  FaTimes, 
  FaHome, 
  FaCalendarAlt, 
  FaUserMd, 
  FaCog, 
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import LogoutConfirmationModal from "@/components/modals/LogoutConfirmationModal";
import { useDoctor } from "@/contexts/DoctorContext";

const Sidebar = ({ 
  activeTab, 
  handleTabClick, 
  isSidebarOpen, 
  setIsSidebarOpen,
  user
}) => {
  const { logout } = useAuth();
  const { doctor } = useDoctor();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
      name: "profile",
      label: "My Profile",
      icon: <FaUserMd className="w-5 h-5" />,
    },
    {
      name: "settings",
      label: "Settings",
      icon: <FaCog className="w-5 h-5" />,
    },
  ];

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const handleLogoutClick = () => setShowLogoutConfirm(true);
  const handleConfirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };
  const handleCancelLogout = () => setShowLogoutConfirm(false);

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
        className="hidden md:flex fixed bottom-20 z-50 items-center justify-center w-8 h-8 bg-gradient-to-r from-[#1dd3b0] to-green-200 text-white rounded-full shadow-lg hover:from-[#90f1ef] hover:to-[#1dd3b0] transition-all duration-300 border border-blue-200"
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
        <div className={`flex flex-col h-screen ${isCollapsed ? 'w-20' : 'w-72'} bg-white text-[#0F172A] shadow-xl overflow-y-auto transition-all duration-300`}>
          
          {/* Sidebar Header */}
          <div className={`mt-2 p-4 flex flex-col ${isCollapsed ? 'items-center' : ''}`}>
            <div className="flex items-center justify-between w-full">
              {!isCollapsed ? (
                <Link href="/doctor/dashboard" className="group">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-[#1dd3b0] rounded-md flex items-center justify-center mr-2 shadow-md border-2 border-blue-200">
                      <span className="text-white font-bold text-2xl">S</span>
                    </div>
                    <div>
                      <span className="text-[#1dd3b0] font-bold text-xl">Second</span>
                      <span className="text-[#1dd3b0] font-bold text-xl ml-1">Opinion</span>
                      <div className="h-0.5 w-0 group-hover:w-full bg-blue-400 transition-all duration-300 ease-in-out"></div>
                    </div>
                  </div>
                </Link>
              ) : (
                <Link href="/doctor/dashboard" className="mx-auto">
                  <div className="h-12 w-12 bg-[#1dd3b0] rounded-md flex items-center justify-center shadow-md border-2 border-blue-200">
                    <span className="text-white font-bold text-2xl">S</span>
                  </div>
                </Link>
              )}
              <button
                className="md:hidden text-[#1dd3b0] border border-blue-200 p-1 rounded-md hover:bg-[#90f1ef]"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className={`mt-6 flex ${isCollapsed ? 'flex-col items-center' : 'items-center'} border-y border-blue-200 py-6`}>
              <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-[#1dd3b0] border-2 border-blue-200">
                <img
                  src={doctor?.profilePhoto || user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor?.name || user?.displayName || 'Doctor')}&background=60a5fa&color=fff`}
                  alt="Doctor"
                  className="w-full h-full object-cover"
                  width={48}
                  height={48}
                />
              </div>
              {!isCollapsed && (
                <div className="ml-3 overflow-hidden">
                  <p className="font-medium text-[#0F172A] truncate max-w-[180px]">
                    {doctor?.name || user?.displayName || 'Dr. John Doe'}
                  </p>
                  <p className="text-xs text-[#0F172A]">{doctor?.specialization || user?.specialization || 'Physician'}</p>
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
                    href={`/doctor/${item.name}`}
                    className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === item.name
                        ? "bg-[#1dd3b0] text-[#0F172A] font-medium shadow-md"
                        : "text-[#0F172A] hover:bg-[#90f1ef] hover:text-[#0F172A]"
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

          {/* Logout Button */}
          <div className="p-4 mt-auto border-t border-gray-200">
            <button 
              onClick={handleLogoutClick}
              className={`group flex items-center w-full px-4 py-3 text-[#0F172A] bg-white hover:bg-[#f39292] rounded-lg transition-all duration-300 shadow-sm border border-blue-200 hover:border-red-200 ${isCollapsed ? 'justify-center' : ''}`}
            >
              <span className="inline-flex items-center justify-center bg-red-100 p-1.5 rounded-full">
                <FaSignOutAlt className={`${isCollapsed ? '' : 'mr-3'} transition-all duration-300 group-hover:text-black text-red-500`} size={16} />
              </span>
              {!isCollapsed && <span className="font-medium ml-2 group-hover:text-red-600">Sign Out</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export default Sidebar;
