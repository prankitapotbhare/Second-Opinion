import React from 'react';
import Link from 'next/link';

const DoctorCard = ({ doctor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
      <img
        src={doctor.photoURL}
        alt={doctor.name || 'Doctor'}
        className="w-24 h-24 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-xl font-semibold text-gray-900">{doctor.name || 'Dr. Anonymous'}</h3>
        {doctor.specialization && <p className="text-gray-600">{doctor.specialization}</p>}
        {doctor.degree && <p className="text-gray-600">{doctor.degree}</p>}
        {doctor.experience && <p className="text-gray-600">Experience: {doctor.experience} years</p>}
      </div>
      <div className="flex flex-col space-y-2 w-full sm:w-auto">
        <Link href={`/patient/doctors/${doctor.id}`} className="w-full">
          <button className="w-full bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 whitespace-nowrap">
            Know More
          </button>
        </Link>
        <Link href={`/patient/patient-details?doctorId=${doctor.id}`} className="w-full">
          <button className="w-full bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 whitespace-nowrap">
            Book Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;