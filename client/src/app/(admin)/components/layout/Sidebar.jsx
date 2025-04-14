"use client";

import React, { useState, useRef } from 'react';
import { 
  FaTachometerAlt, 
  FaUserMd, 
  FaUsers, 
  FaCalendarAlt, 
  FaCog, 
  FaSignOutAlt,
  FaTimes,
  FaHospital,
  FaChevronRight
} from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
  const { logout } = useAuth();
  const { isSidebarOpen, setIsSidebarOpen, activeTab, setActiveTab } = useAdmin();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const sidebarRef = useRef(null);
  const router = useRouter();
  
  useOnClickOutside(sidebarRef, () => {
    if (window.innerWidth < 768 && isSidebarOpen) {
      handleClose();
    }
  });

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <FaTachometerAlt /> },
    { id: 'doctors', name: 'Doctors', icon: <FaUserMd /> },
    { id: 'patients', name: 'Patients', icon: <FaUsers /> },
    { id: 'appointments', name: 'Appointments', icon: <FaCalendarAlt /> },
    { id: 'settings', name: 'Settings', icon: <FaCog /> },
  ];

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsSidebarOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    
    // Navigate to the corresponding route
    router.push(`/admin/${tabId}`);
    
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      handleClose();
    }
  };

  return (
    <div className={`fixed inset-0 z-40 md:h-screen md:relative transition-all duration-300 ease-in-out ${
      isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'
    }`}>
      {/* Backdrop overlay with blur effect */}
      <div 
        className={`md:hidden absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      ></div>
      
      {/* Sidebar container with slide animation */}
      <div 
        ref={sidebarRef}
        className={`w-74 h-full fixed inset-y-0 left-0 md:h-screen md:relative bg-white z-50 shadow-xl md:shadow-md
                   transition-transform duration-300 ease-out ${
                     isSidebarOpen && !isClosing ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                   }`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="py-4 px-6 flex items-center justify-between gap-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className={`bg-blue-600 text-white p-2 rounded-lg shadow-md transform transition-all duration-500 ${isHovering ? 'scale-110' : 'scale-100'}`}>
              <FaHospital className={`text-xl transition-all duration-500 ${isHovering ? 'rotate-12' : 'rotate-0'}`} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Second Opinion</h1>
          </div>
          <button 
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:text-blue-600"
            onClick={handleClose}
            aria-label="Close menu"
          >
            <FaTimes className="transition-all duration-300 transform hover:rotate-90" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button 
                  onClick={() => handleTabClick(item.id)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === item.id 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className={`mr-4 text-lg transition-all duration-300 ${
                    hoveredItem === item.id && activeTab !== item.id ? 'transform scale-110' : ''
                  }`}>
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.name}</span>
                  {activeTab === item.id && (
                    <span className="ml-auto w-2 h-8 bg-white rounded-full"></span>
                  )}
                  {hoveredItem === item.id && activeTab !== item.id && (
                    <FaChevronRight className="ml-auto text-gray-400" />
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
    </div>
  );
};

export default Sidebar;