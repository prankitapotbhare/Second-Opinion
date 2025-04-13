"use client";

import React, { useState } from 'react';
import { doctors } from '@/data/doctorsData';
import SearchBar from './components/SearchBar';
import DoctorGrid from './components/DoctorGrid';

export default function DoctorsSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  
  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Determine which doctors to display
  const displayedDoctors = searchTerm ? filteredDoctors : doctors;
  
  const toggleShowAll = () => {
    setShowAll(!showAll);
    // Scroll to top when showing all doctors
    if (!showAll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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