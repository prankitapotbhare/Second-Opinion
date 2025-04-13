"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaTachometerAlt, 
  FaUserMd, 
  FaUsers, 
  FaCalendarAlt, 
  FaCog, 
  FaSignOutAlt,
  FaTimes
} from 'react-icons/fa';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const pathname = usePathname();
  const isActive = (path) => pathname.includes(path);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Doctors', path: '/admin/doctors', icon: <FaUserMd /> },
    { name: 'Patients', path: '/admin/patients', icon: <FaUsers /> },
    { name: 'Appointments', path: '/admin/appointments', icon: <FaCalendarAlt /> },
    { name: 'Settings', path: '/admin/settings', icon: <FaCog /> },
  ];

  return (
    <div 
      className={`fixed md:static top-0 left-0 h-full bg-white shadow-lg z-40 w-64 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="p-6">
        <Link href="/admin/dashboard" className="flex items-center justify-center">
          <h1 className="text-xl font-bold text-blue-600">Second Opinion</h1>
        </Link>
      </div>

      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link 
                href={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path) 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-full p-4">
        <button className="flex items-center justify-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <FaSignOutAlt className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;