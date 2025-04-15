"use client";

import React, { useState } from 'react';
import { doctors } from '@/data/doctorsData';
import SearchBar from './components/SearchBar';
import DoctorGrid from './components/DoctorGrid';
import { useSearchParams } from 'next/navigation';

export default function DoctorsSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  const searchParams = useSearchParams();

  // Get filters from query params
  const locationFilter = searchParams.get('location') || '';
  const departmentFilter = searchParams.get('department') || '';

  // Filter doctors based on search term, location, and department
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch =
      (doctor.name && doctor.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doctor.specialization && doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLocation = locationFilter
      ? (doctor.location && doctor.location.toLowerCase() === locationFilter.toLowerCase())
      : true;
    const matchesDepartment = departmentFilter
      ? (doctor.specialization && doctor.specialization.toLowerCase() === departmentFilter.toLowerCase())
      : true;
    return matchesSearch && matchesLocation && matchesDepartment;
  });

  // Determine which doctors to display
  const displayedDoctors = searchTerm ? filteredDoctors : doctors.filter(doctor => {
    const matchesLocation = locationFilter
      ? (doctor.location && doctor.location.toLowerCase() === locationFilter.toLowerCase())
      : true;
    const matchesDepartment = departmentFilter
      ? (doctor.specialization && doctor.specialization.toLowerCase() === departmentFilter.toLowerCase())
      : true;
    return matchesLocation && matchesDepartment;
  });

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Find a Doctor</h1>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      
      {/* Doctors Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <DoctorGrid 
          doctors={displayedDoctors} 
          showAll={showAll} 
          toggleShowAll={toggleShowAll}
        />
      </div>
    </div>
  );
}