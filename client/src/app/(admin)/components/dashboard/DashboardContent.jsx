"use client";

import React from 'react';
import { FaUserMd, FaUsers, FaCalendarCheck, FaClock } from 'react-icons/fa';
import { statCards, doctors as mockDoctors, activities } from '@/data/mockData';
import { doctors as staticDoctors } from '@/data/doctorsData';
import { useAuth } from "@/contexts/AuthContext";

// Import components
import { 
  Header, 
  StatCard, 
  DoctorList, 
  AppointmentsChart, 
  RecentActivity 
} from '@/app/(admin)/components';

const DashboardContent = () => {
  const { currentUser } = useAuth();
  
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

  // Combine doctors from both sources and format them for the DoctorList component
  const combinedDoctors = [
    ...mockDoctors.map(doc => ({
      ...doc,
      status: doc.status || 'Active',
      patients: doc.patients || 0,
      avatar: doc.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}`
    })),
    ...staticDoctors.map(doc => ({
      id: doc.id,
      name: doc.name,
      specialization: doc.specialization || doc.department,
      email: `${doc.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      patients: Math.floor(Math.random() * 50) + 10,
      status: 'Active',
      avatar: doc.imageUrl
    }))
  ];

  return (
    <div className="min-h-screen bg-[#f0f8ff]">
      <Header title="Admin Dashboard" />
      
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
        <DoctorList doctors={combinedDoctors.slice(0, 5)} />
        
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

export default DashboardContent;