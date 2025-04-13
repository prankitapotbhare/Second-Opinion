import React from 'react';
import DoctorCard from './DoctorCard';
import Link from 'next/link';

const DoctorGrid = ({ doctors, showAll = false }) => {
  const displayedDoctors = showAll ? doctors : doctors.slice(0, 8);
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedDoctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
      
      {!showAll && doctors.length > 8 && (
        <div className="flex justify-center mt-8">
          <Link href="/user/doctors/all">
            <button className="bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-200 text-lg font-semibold whitespace-nowrap">
              See All Doctors
            </button>
          </Link>
        </div>
      )}
      
      {doctors.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-700">No doctors found matching your search</h3>
          <p className="text-gray-500 mt-2">Try a different search term or browse all doctors</p>
        </div>
      )}
    </div>
  );
};

export default DoctorGrid;