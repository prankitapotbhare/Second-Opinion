"use client";

import React from 'react';
import { FaUserMd, FaUsers, FaCalendarCheck, FaClock } from 'react-icons/fa';
import { statCards, activities } from '@/data/mockData'; // Keep activities from mockData for now
// import { doctors as staticDoctors } from '@/data/doctorsData'; // Remove old import
import { doctors as combinedDoctorsData } from '@/data/doctorsData'; // Import the consolidated data
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

  // Format the combined doctors data for the DoctorList component
  // No need to combine sources here anymore
  const formattedDoctors = combinedDoctorsData.map(doc => ({
    id: doc.id, // Use id
    name: doc.name, // Use name
    specialization: doc.specialization,
    email: doc.email || `${doc.name.toLowerCase().replace(/\s+/g, '.')}@example.com`, // Ensure email exists
    patients: doc.patients || Math.floor(Math.random() * 50) + 10, // Ensure patients exist
    status: doc.status || 'Active', // Ensure status exists
    avatar: doc.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}` // Use imageUrl
  }));


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

        {/* Doctor List - Use formattedDoctors */}
        <DoctorList doctors={formattedDoctors.slice(0, 5)} />

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