"use client";

import React, { useState } from 'react';
import { Header } from '@/app/(admin)/components';
import { useAuth } from "@/contexts/AuthContext";
import { FaSearch, FaFilter, FaCalendarPlus, FaEye, FaCheck, FaTimes } from 'react-icons/fa';
import { doctors } from '@/data/doctorsData';

// Generate appointments using the doctors data
const generateAppointments = () => {
  const patientNames = [
    'John Doe', 'Jane Smith', 'Robert Wilson', 'Emily Davis', 'Michael Johnson',
    'Sarah Williams', 'David Brown', 'Lisa Jones', 'James Miller', 'Jennifer Taylor',
    'Amit Verma', 'Priya Malhotra', 'Rahul Mehta', 'Neha Agarwal', 'Ravi Kumar'
  ];
  
  const appointmentTypes = ['Video Consultation', 'In-Person'];
  const statuses = ['Confirmed', 'Pending', 'Completed', 'Cancelled'];
  
  const generatedAppointments = [];
  
  for (let i = 0; i < 20; i++) {
    const doctor = doctors[Math.floor(Math.random() * doctors.length)];
    const patientName = patientNames[Math.floor(Math.random() * patientNames.length)];
    const type = appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Generate a random date within the next 14 days
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 14));
    const formattedDate = date.toISOString().split('T')[0];
    
    // Generate a random time between 9 AM and 5 PM
    const hour = 9 + Math.floor(Math.random() * 8);
    const minute = Math.floor(Math.random() * 4) * 15;
    const formattedTime = `${hour}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
    
    generatedAppointments.push({
      id: `APT-${1000 + i}`,
      patientName,
      patientAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(patientName)}&background=3b82f6&color=fff`,
      doctorName: doctor.name,
      doctorAvatar: doctor.imageUrl,
      date: formattedDate,
      time: formattedTime,
      type,
      status
    });
  }
  
  return generatedAppointments;
};

// Generate appointments once
const appointments = generateAppointments();

const AppointmentsContent = ({ setIsSidebarOpen }) => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Filter appointments based on search term, status, and type
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || appointment.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesType = filterType === 'all' || appointment.type.toLowerCase().includes(filterType.toLowerCase());
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#f0f8ff]">
      <Header title="Manage Appointments" user={currentUser} setIsSidebarOpen={setIsSidebarOpen} />
      
      <main className="max-w-[1440px] mx-auto px-6 pb-8">
        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search appointments..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="video">Video Consultation</option>
                <option value="in-person">In-Person</option>
              </select>
              <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <FaCalendarPlus /> Add Appointment
            </button>
          </div>
        </div>
        
        {/* Appointments Table */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{appointment.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden">
                          <img src={appointment.patientAvatar} alt={appointment.patientName} className="h-full w-full object-cover" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden">
                          <img src={appointment.doctorAvatar} alt={appointment.doctorName} className="h-full w-full object-cover" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{appointment.doctorName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.date}</div>
                      <div className="text-sm text-gray-500">{appointment.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                          appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          appointment.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-2">
                        <FaEye />
                      </button>
                      {appointment.status === 'Pending' && (
                        <>
                          <button className="text-green-600 hover:text-green-900 mr-2">
                            <FaCheck />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <FaTimes />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredAppointments.length}</span> of{" "}
            <span className="font-medium">{appointments.length}</span> results
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppointmentsContent;