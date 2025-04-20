"use client";

import React, { useState } from 'react';
import { doctors as doctorsData } from '@/data/doctorsData';
import SearchBar from './components/SearchBar';
import DoctorGrid from './components/DoctorGrid';
import { useSearchParams } from 'next/navigation';

export default function DoctorsSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  const searchParams = useSearchParams();

  // Get filters from query params
  const locationFilter = searchParams.get('location') || '';
  const specializationFilter = searchParams.get('department') || searchParams.get('specialization') || ''; // Accept both for compatibility

  // Filter doctors based on search term, location, and specialization
  const filteredDoctors = doctorsData.filter(doctor => { // Use consolidated data
    const matchesSearch =
      (doctor.name && doctor.name.toLowerCase().includes(searchTerm.toLowerCase())) || // Use name
      (doctor.specialization && doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())); // Use specialization
    const matchesLocation = locationFilter
      ? (doctor.location && doctor.location.toLowerCase().includes(locationFilter.toLowerCase())) // Use location, use includes for partial match
      : true;
    const matchesSpecialization = specializationFilter
      ? (doctor.specialization && doctor.specialization.toLowerCase() === specializationFilter.toLowerCase()) // Use specialization
      : true;
    return matchesSearch && matchesLocation && matchesSpecialization;
  });

  // Determine which doctors to display based on filters only (search is handled by filteredDoctors)
  const displayedDoctors = doctorsData.filter(doctor => { // Use consolidated data
    const matchesLocation = locationFilter
      ? (doctor.location && doctor.location.toLowerCase().includes(locationFilter.toLowerCase())) // Use location, use includes
      : true;
    const matchesSpecialization = specializationFilter
      ? (doctor.specialization && doctor.specialization.toLowerCase() === specializationFilter.toLowerCase()) // Use specialization
      : true;
    return matchesLocation && matchesSpecialization;
  });

  // If there's a search term, use the filtered list, otherwise use the list filtered by params
  const doctorsToDisplay = searchTerm ? filteredDoctors : displayedDoctors;


  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Find a Doctor</h1>
        {/* Pass location and specialization filters to SearchBar if it uses them */}
        <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            initialLocation={locationFilter}
            initialSpecialization={specializationFilter}
         />
      </div>

      {/* Doctors Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <DoctorGrid
          doctors={doctorsToDisplay} // Pass the correctly filtered list
          showAll={showAll}
          toggleShowAll={toggleShowAll}
        />
      </div>
    </div>
  );
}