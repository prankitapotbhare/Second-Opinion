"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePatient } from '@/contexts/PatientContext';
import SearchBar from './components/SearchBar';
import DoctorGrid from './components/DoctorGrid';
import DoctorCardSkeleton from './components/DoctorCardSkeleton';

export default function DoctorsSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isChangingPage, setIsChangingPage] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const gridRef = useRef(null);

  // Get context data and functions
  const {
    doctors,
    doctorsLoading,
    doctorsError,
    fetchDoctors,
    pagination,
  } = usePatient();

  // Get filters from query params
  const locationFilter = searchParams.get('location') || '';
  const specializationFilter = searchParams.get('department') || searchParams.get('specialization') || '';
  const pageParam = searchParams.get('page') ? parseInt(searchParams.get('page')) : 1;

  // Fetch doctors on initial load and when filters or page changes
  useEffect(() => {
    const params = {};

    if (locationFilter) {
      params.location = locationFilter;
    }

    if (specializationFilter) {
      params.department = specializationFilter;
    }

    // Add pagination params
    params.page = pageParam;
    params.limit = pagination.limit || 8; // Ensure we have a default limit

    setIsChangingPage(true);

    fetchDoctors(params).finally(() => {
      setIsChangingPage(false);
    });
    // Only depend on filters and pageParam, not pagination.currentPage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchDoctors, locationFilter, specializationFilter, pageParam, pagination.limit]);

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(doctor => {
    if (!searchTerm.trim()) return true;

    const matchesSearch =
      (doctor.name && doctor.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doctor.specialization && doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  // Handle page change
  const handlePageChange = (newPage) => {
    // Scroll to top of grid when changing pages
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Update URL with new page parameter
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage);

    // Update the URL without refreshing the page
    router.push(`/patient/doctors?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Find a Doctor</h1>
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          initialLocation={locationFilter}
          initialSpecialization={specializationFilter}
        />
      </div>

      {/* Doctors Grid */}
      <div ref={gridRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
        {doctorsError ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-red-600 mb-2">Error loading doctors</h3>
            <p className="text-gray-500">{doctorsError}</p>
          </div>
        ) : (
          <DoctorGrid
            doctors={filteredDoctors}
            pagination={pagination}
            onPageChange={handlePageChange}
            loading={doctorsLoading}
            isChangingPage={isChangingPage}
          />
        )}
      </div>
    </div>
  );
}