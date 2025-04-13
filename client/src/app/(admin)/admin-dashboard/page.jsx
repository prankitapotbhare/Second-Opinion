"use client";

import React from 'react';
import { statCards, doctors, activities} from '@/data/mockData'

// Import components
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import DoctorList from '../components/DoctorList';
import AppointmentsChart from '../components/AppointmentsChart';
import RecentActivity from '../components/RecentActivity';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-[#f0f8ff]">
      <Header title="Admin Panel" />
      
      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-6 pb-8">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
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