"use client";

import React, { useState } from 'react';
import { FaUserMd, FaUsers, FaCalendarCheck, FaClock } from 'react-icons/fa';
import { statCards, activities } from '@/data/mockData';
import { doctors } from '@/data/doctorsData';
import { useAuth } from "@/contexts/AuthContext";

// Import components
import { 
  Header, 
  StatCard, 
  DoctorList, 
  AppointmentsChart, 
  RecentActivity 
} from '@/app/(admin)/components';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
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

  // Prepare doctors data with status for the DoctorList component
  const doctorsWithStatus = doctors.map(doctor => ({
    ...doctor,
    status: doctor.status || 'Active',
    patients: doctor.patients || 0,
    avatar: doctor.profileImage || doctor.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}`
  }));

  return (
    <div className="min-h-screen bg-[#f0f8ff]">
      <Header 
        title="Dashboard" 
        setIsSidebarOpen={setIsSidebarOpen} 
        user={currentUser} 
      />
      
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
        <DoctorList doctors={doctorsWithStatus} />
        
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