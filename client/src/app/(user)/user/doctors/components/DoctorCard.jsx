import React from 'react';
import Link from 'next/link';

const DoctorCard = ({ doctor }) => {
  // Default image if imageUrl is missing
  const defaultImage = "https://via.placeholder.com/96"; // Or use a better default

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
      <img
        src={doctor.imageUrl || defaultImage} // Use imageUrl
        alt={doctor.name || 'Doctor'} // Use name
        className="w-24 h-24 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-xl font-semibold text-gray-900">{doctor.name || 'Dr. Anonymous'}</h3> {/* Use name */}
        {/* Use specialization */}
        {doctor.specialization && <p className="text-gray-600">{doctor.specialization}</p>}
        {/* Use qualification */}
        {doctor.qualification && <p className="text-gray-600">{doctor.qualification}</p>}
         {/* Use experience */}
        {doctor.experience && <p className="text-gray-600">Experience: {doctor.experience}</p>}
      </div>
      <div className="flex flex-col space-y-2 w-full sm:w-auto">
         {/* Use doctor.id */}
        <Link href={`/user/doctors/${doctor.id}`} className="w-full">
          <button className="w-full bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 whitespace-nowrap">
            Know More
          </button>
        </Link>
         {/* Use doctor.id in query param */}
        <Link href={`/user/appointment/booking?doctorId=${doctor.id}`} className="w-full">
          <button className="w-full bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 whitespace-nowrap">
            Book Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;