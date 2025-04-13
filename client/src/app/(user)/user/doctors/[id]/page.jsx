"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { doctors } from '@/data/staticData';
import { LoadingSpinner } from '@/components';
import Link from 'next/link';

// Import components
import DoctorProfileCard from '../components/DoctorProfileCard';
import DoctorDetails from '../components/DoctorDetails';
import BookAppointmentSection from '../components/BookAppointmentSection';

export default function DoctorProfilePage() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Doctor Not Found</h1>
        <Link href="/user/doctors" className="text-green-600 hover:underline">
          Browse Other Doctors
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DoctorProfileCard doctor={doctor} />
        <DoctorDetails doctor={doctor} />
        <BookAppointmentSection doctorId={id} />
      </main>
    </div>
  );
}