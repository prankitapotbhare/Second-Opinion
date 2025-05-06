import React from 'react';
import Link from 'next/link';
import { FaBriefcaseMedical } from 'react-icons/fa';

// Doctor Header Component
const DoctorHeader = ({ doctor }) => (
  <div className="relative bg-white rounded-lg shadow-md p-6 md:p-8 mb-6 flex flex-col md:flex-row items-center md:items-start text-center md:text-left pb-20 md:pb-8">
    <img
      src={doctor.photoURL || "https://via.placeholder.com/160"}
      alt={doctor.name || 'Doctor'}
      className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mb-4 md:mb-0 md:mr-8 border-4 border-gray-100 flex-shrink-0"
    />
    <div className="flex-grow">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{doctor.name || 'Dr. Anonymous'}</h1>
      {doctor.specialization && <p className="text-teal-600 font-medium text-lg mb-2">{doctor.specialization}</p>}
      {doctor.degree && <p className="text-gray-600 text-sm mb-1">{doctor.degree}</p>}
      {doctor.experience && <p className="text-gray-600 text-sm mb-1">Experience: {doctor.experience} years</p>}
      {doctor.hospitalAffiliation && (
         <p className="text-gray-600 text-sm mb-4 flex items-center justify-center md:justify-start">
            <FaBriefcaseMedical className="mr-2 text-gray-500" /> {doctor.hospitalAffiliation}
         </p>
      )}
    </div>
    {doctor.id && (
        <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 mt-4 md:mt-0 w-[calc(100%-3rem)] md:w-auto">
            <Link href={`/patient/patient-details?doctorId=${doctor.id}`} className="block w-full md:w-auto">
                <button className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-200 font-medium shadow-sm whitespace-nowrap">
                Book a Consultation
                </button>
            </Link>
        </div>
    )}
  </div>
);

export default DoctorHeader;