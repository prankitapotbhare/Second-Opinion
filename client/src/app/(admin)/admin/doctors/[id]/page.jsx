"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AdminHeader } from '@/app/(admin)/components';

const DoctorDetails = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch doctor data based on ID
    // This is a mock implementation
    import('@/data/mockData').then(({ doctors }) => {
      const foundDoctor = doctors.find(d => d.id.toString() === id);
      setDoctor(foundDoctor || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-[#f0f8ff]">
        <AdminHeader title="Doctor Not Found" />
        <div className="max-w-[1440px] mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Doctor Not Found</h2>
          <p className="text-gray-600">The doctor you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f8ff]">
      <AdminHeader title={`Doctor: ${doctor.name}`} />
      
      <main className="max-w-[1440px] mx-auto px-6 pb-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="md:w-1/4">
              <div className="w-40 h-40 rounded-full overflow-hidden mx-auto">
                <img
                  src={doctor.imageUrl || "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20doctor&width=200&height=200&seq=1&orientation=squarish"}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="md:w-3/4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{doctor.name}</h2>
              <p className="text-lg text-blue-600 mb-4">{doctor.specialization}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-600"><strong>Status:</strong> {doctor.status}</p>
                  <p className="text-gray-600"><strong>Patients:</strong> {doctor.patients}</p>
                </div>
                <div>
                  <p className="text-gray-600"><strong>Experience:</strong> {doctor.experience || "N/A"}</p>
                  <p className="text-gray-600"><strong>Location:</strong> {doctor.location || "N/A"}</p>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Contact Doctor
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  View Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDetails;