import React from 'react';
import { FaStar, FaMapMarkerAlt, FaStethoscope, FaCalendarAlt } from 'react-icons/fa';
import Link from 'next/link';

const DoctorProfileCard = ({ doctor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="md:flex">
        <div className="md:w-1/3 p-6 flex justify-center">
          <div className="w-48 h-48 rounded-full overflow-hidden">
            <img 
              src={doctor.imageUrl || "https://via.placeholder.com/200"} 
              alt={doctor.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="md:w-2/3 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{doctor.name}</h1>
              <p className="text-blue-600 font-medium">{doctor.specialization}</p>
            </div>
            <div className="flex items-center mt-2 md:mt-0">
              <div className="flex items-center mr-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={i < Math.floor(doctor.rating) ? "text-yellow-400" : "text-gray-300"} 
                  />
                ))}
              </div>
              <span className="text-gray-600">({doctor.reviewCount} reviews)</span>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <FaStethoscope className="text-blue-600 mr-2" />
              <span className="text-gray-700">{doctor.experience} years experience</span>
            </div>
            <div className="flex items-center mb-2">
              <FaMapMarkerAlt className="text-blue-600 mr-2" />
              <span className="text-gray-700">{doctor.location}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {doctor.specialties.map((specialty, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {specialty}
              </span>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={`/user/appointment/book?doctorId=${doctor.id}`}>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center">
                <FaCalendarAlt className="mr-2" />
                Book Appointment
              </button>
            </Link>
            <Link href={`/user/doctors/${doctor.id}/reviews`}>
              <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                View Reviews
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileCard;