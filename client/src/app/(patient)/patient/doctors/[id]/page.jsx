"use client";

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { usePatient } from '@/contexts/PatientContext';
import { LoadingSpinner } from '@/components';
import Link from 'next/link';

// Import components from their files
import DoctorHeader from '../components/DoctorHeader';
import ProfessionalDetails from '../components/ProfessionalDetails';
import AboutSection from '../components/AboutSection';
import PatientReviewsCarousel from '../components/PatientReviewsCarousel';

export default function DoctorProfilePage() {
  const { id } = useParams();
  const { 
    currentDoctor, 
    doctorLoading, 
    doctorError, 
    fetchDoctorById 
  } = usePatient();

  useEffect(() => {
    if (id) {
      fetchDoctorById(id);
    }
  }, [id, fetchDoctorById]);

  if (doctorLoading) {
    return <LoadingSpinner />;
  }

  if (doctorError || !currentDoctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Doctor Not Found</h1>
        <p className="text-gray-600 mb-6">
          {doctorError || "We couldn't find the doctor profile you were looking for."}
        </p>
        <Link href="/patient/doctors" className="text-teal-600 hover:text-teal-700 font-medium px-6 py-2 rounded-lg border border-teal-600 hover:bg-teal-50 transition-colors duration-200">
          Browse Other Doctors
        </Link>
      </div>
    );
  }

  // --- Main Page Structure ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 1. Header Section */}
        <DoctorHeader doctor={currentDoctor} />

        {/* 2. Professional Details Section */}
        <ProfessionalDetails doctor={currentDoctor} />

        {/* 3. About Section */}
        <AboutSection doctor={currentDoctor} />

        {/* 4. Patient Reviews Section - Keep for now but will update later */}
        <PatientReviewsCarousel reviews={[]} />
      </div>
    </div>
  );
}

// --- Removed Inline Helper Components ---
// They are now in separate files within the ./components directory
