"use client";

import React, { useState } from 'react';
import { Header } from '@/app/(admin)/components';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import { doctors as mockDoctors } from '@/data/mockData';
import { doctors as staticDoctors } from '@/data/doctorsData';
import Link from 'next/link';

const DoctorsContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Combine and format doctors data from both sources
  const combinedDoctors = [
    ...mockDoctors.map(doc => ({
      ...doc,
      status: doc.status === 'active' ? 'Active' : doc.status === 'inactive' ? 'Inactive' : 'Pending',
      specialization: doc.specialization,
      email: doc.email || `${doc.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      avatar: doc.profileImage
    })),
    ...staticDoctors.map(doc => ({
      id: doc.id,
      name: doc.name || `Doctor ${doc.id || Math.floor(Math.random() * 1000)}`,
      specialization: doc.specialization || doc.department,
      email: doc.name ? `${doc.name.toLowerCase().replace(/\s+/g, '.')}@example.com` : `doctor${doc.id || Math.random().toString(36).substr(2, 9)}@example.com`,
      patients: Math.floor(Math.random() * 50) + 10,
      status: Math.random() > 0.2 ? 'Active' : 'Pending',
      avatar: doc.imageUrl
    }))
  ];

  // Filter doctors based on search term and status
  const filteredDoctors = combinedDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (doctor.specialization && doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || 
                         (doctor.status && doctor.status.toLowerCase() === filterStatus.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#f0f8ff]">
      <Header title="Manage Doctors" />
      
      <main className="max-w-[1440px] mx-auto px-6 pb-8">
        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search doctors..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative">
              <select
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
              <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            
            <Link href="/admin/doctors/add">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <FaPlus /> Add Doctor
              </button>
            </Link>
          </div>
        </div>
        
        {/* Doctors Table */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialization
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patients
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDoctors.map((doctor, index) => (
                  <tr key={doctor.id || index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                          <img 
                            src={doctor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}`} 
                            alt={doctor.name} 
                            className="h-full w-full object-cover" 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                          <div className="text-sm text-gray-500">{doctor.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doctor.specialization}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${doctor.status === 'Active' ? 'bg-green-100 text-green-800' : 
                          doctor.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {doctor.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doctor.patients || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/admin/doctors/${doctor.id}`} className="text-blue-600 hover:text-blue-900 mr-3">View</Link>
                      <Link href={`/admin/doctors/${doctor.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</Link>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
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
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredDoctors.length}</span> of{" "}
            <span className="font-medium">{combinedDoctors.length}</span> results
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

export default DoctorsContent;