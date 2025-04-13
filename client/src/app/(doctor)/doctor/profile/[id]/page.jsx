"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { doctors } from '@/data/staticData';
import { reviews } from '@/data/reviewsData';

// Import components
import DoctorProfileCard from '../components/DoctorProfileCard';
import ProfessionalDetails from '../components/ProfessionalDetails';
import AboutDoctor from '../components/AboutDoctor';
import Reviews from '../components/Reviews';
import LoadingSpinner from '../components/LoadingSpinner';
import NotFound from '../components/NotFound';

export default function DoctorProfilePage() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, you would fetch the doctor data from an API
    // For now, we'll use the static data
    const foundDoctor = doctors.find(doc => doc.id === id);
    if (foundDoctor) {
      setDoctor(foundDoctor);
    }
    setLoading(false);
  }, [id]);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!doctor) {
    return <NotFound />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DoctorProfileCard doctor={doctor} id={id} />
        <ProfessionalDetails doctor={doctor} />
        <AboutDoctor doctor={doctor} />
        <Reviews 
          reviews={reviews} 
          activeReviewIndex={activeReviewIndex} 
          setActiveReviewIndex={setActiveReviewIndex} 
        />
      </main>
    </div>
  );
}