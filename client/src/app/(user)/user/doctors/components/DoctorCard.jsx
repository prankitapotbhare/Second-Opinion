import React from 'react';
import Link from 'next/link';

const DoctorCard = ({ doctor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-6">
      <img
        src={doctor.photoURL || doctor.imageUrl}
        alt={doctor.displayName || doctor.name}
        className="w-24 h-24 rounded-full object-cover"
      />
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-900">{doctor.displayName || doctor.name}</h3>
        <p className="text-gray-600">{doctor.specialization}</p>
        <p className="text-gray-600">{doctor.qualification}</p>
        <p className="text-gray-600">Experience: {doctor.experience}</p>
      </div>
      <div className="flex flex-col space-y-2">
        <Link href={`/user/doctors/${doctor.uid || doctor.id}`}>
          <button className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 whitespace-nowrap">
            Know More
          </button>
        </Link>
        <Link href={`/user/appointment/booking?doctorId=${doctor.uid || doctor.id}`}>
          <button className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200 whitespace-nowrap">
            Book Now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;