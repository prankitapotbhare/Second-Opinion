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
      className={`fixed md:static top-0 left-0 h-full bg-white shadow-xl z-40 w-72 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="py-8 px-6 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <FaHospital className="text-xl" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Second Opinion</h1>
        </div>
        <button 
          className="md:hidden text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
          onClick={() => setIsSidebarOpen(false)}
        >
          <FaTimes className="text-xl" />
        </button>
      </div>

      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button 
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className={`mr-4 text-lg ${activeTab === item.id ? 'text-white' : ''}`}>{item.icon}</span>
                <span className="font-medium">{item.name}</span>
                {activeTab === item.id && (
                  <span className="ml-auto w-2 h-8 bg-white rounded-full"></span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
        <button 
          onClick={logout}
          className="flex items-center justify-center w-full px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-200 font-medium"
        >
          <FaSignOutAlt className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;