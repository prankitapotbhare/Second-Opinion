"use client";

import React from 'react';
import { 
  FaTachometerAlt, 
  FaUserMd, 
  FaUsers, 
  FaCalendarAlt, 
  FaCog, 
  FaSignOutAlt,
  FaTimes,
  FaHospital
} from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, activeTab, setActiveTab }) => {
  const { logout } = useAuth();

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <FaTachometerAlt /> },
    { id: 'doctors', name: 'Doctors', icon: <FaUserMd /> },
    { id: 'patients', name: 'Patients', icon: <FaUsers /> },
    { id: 'appointments', name: 'Appointments', icon: <FaCalendarAlt /> },
    { id: 'settings', name: 'Settings', icon: <FaCog /> },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div 
      className={`fixed md:static top-0 left-0 h-full bg-gradient-to-b from-blue-50 to-white shadow-lg z-40 w-64 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="p-6 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <FaHospital className="text-blue-600 text-xl" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Second Opinion</h1>
        </div>
        <button 
          className="md:hidden text-gray-500 hover:text-gray-700 transition-colors"
          onClick={() => setIsSidebarOpen(false)}
        >
          <FaTimes />
        </button>
      </div>

      <nav className="mt-6">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.id}>
              <button 
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <span className={`mr-3 text-lg ${activeTab === item.id ? 'text-white' : 'text-blue-500'}`}>{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
        <button 
          onClick={logout}
          className="flex items-center justify-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:shadow-md"
        >
          <FaSignOutAlt className="mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;