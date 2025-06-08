"use client";

import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const SearchBar = ({ searchTerm, setSearchTerm, initialLocation, initialSpecialization }) => {
  const [location, setLocation] = useState(initialLocation || '');
  const [specialization, setSpecialization] = useState(initialSpecialization || '');
  const [inputValue, setInputValue] = useState(searchTerm);
  const router = useRouter();

  // Update local state when props change
  useEffect(() => {
    setLocation(initialLocation || '');
    setSpecialization(initialSpecialization || '');
  }, [initialLocation, initialSpecialization]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 350);
    return () => clearTimeout(handler);
  }, [inputValue, setSearchTerm]);

  // Handle filter submission
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    
    // Build query params
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (specialization) params.set('department', specialization);
    
    // Navigate to the same page with updated query params
    router.push(`/patient/doctors?${params.toString()}`);
  };

  return (
    <div className="mb-8">
      {/* Search input */}
      <div className="relative max-w-2xl mx-auto mb-6">
        <input
          type="text"
          className="w-full p-4 pl-12 text-gray-900 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          placeholder="Search by doctor name or specialization"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
      </div>

      {/* Filter form */}
      {/* <form onSubmit={handleFilterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
        <div className="flex-1">
          <input
            type="text"
            className="w-full p-3 text-gray-900 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="Location (city, state)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            className="w-full p-3 text-gray-900 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="Specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-200 font-medium"
        >
          Filter
        </button>
      </form> */}
    </div>
  );
};

export default SearchBar;