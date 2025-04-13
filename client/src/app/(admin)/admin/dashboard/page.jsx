"use client";

import React, { useState } from 'react';
import { FaUserMd, FaUsers, FaCalendarCheck, FaClock } from 'react-icons/fa';
import { statCards, doctors, activities } from '@/data/mockData';

// Import components
import { 
  AdminHeader, 
  StatCard, 
  DoctorList, 
  AppointmentsChart, 
  RecentActivity 
} from '@/components';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Add icons to stat cards
  const statCardsWithIcons = statCards.map(card => {
    let icon;
    switch(card.title) {
      case 'Total Doctors': icon = <FaUserMd />; break;
      case 'Total Patients': icon = <FaUsers />; break;
      case 'Total Appointments': icon = <FaCalendarCheck />; break;
      case 'Appointments Pending': icon = <FaClock />; break;
      default: icon = null;
    }
    return { ...card, icon };
  });

  return (
    <div className="min-h-screen bg-[#f0f8ff]">
      <AdminHeader title="Admin Panel" setIsSidebarOpen={setIsSidebarOpen} />
      
      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-6 pb-8">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCardsWithIcons.map((card, index) => (
            <StatCard 
              key={index}
              title={card.title}
              count={card.count}
              icon={card.icon}
              color={card.color}
            />
          ))}
        </div>
        
        {/* Doctor List */}
        <DoctorList doctors={doctors} />
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Appointments Chart */}
          <AppointmentsChart />
          
          {/* Recent Activity */}
          <RecentActivity activities={activities} />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;