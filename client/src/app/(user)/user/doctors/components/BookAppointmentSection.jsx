import React from 'react';
import { FaCalendarAlt, FaClock, FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';

const BookAppointmentSection = ({ doctorId }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Book an Appointment</h2>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaInfoCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Book your appointment with this doctor. You can choose between video consultation or in-person visit.
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all">
            <div className="flex items-center mb-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                <FaClock />
              </div>
              <h3 className="font-medium text-gray-800">Video Consultation</h3>
            </div>
            <p className="text-gray-600 mb-4">Consult with the doctor from the comfort of your home</p>
            <p className="text-sm font-medium text-blue-600 mb-4">₹1200</p>
            <Link href={`/user/appointment/booking?doctorId=${doctorId}&type=chat`}>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Book Video Consultation
              </button>
            </Link>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:border-green-500 hover:shadow-md transition-all">
            <div className="flex items-center mb-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                <FaCalendarAlt />
              </div>
              <h3 className="font-medium text-gray-800">In-Person Visit</h3>
            </div>
            <p className="text-gray-600 mb-4">Visit the doctor at their clinic</p>
            <p className="text-sm font-medium text-green-600 mb-4">₹1500</p>
            <Link href={`/user/appointment/booking?doctorId=${doctorId}&type=in-person`}>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Book In-Person Visit
              </button>
            </Link>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-md font-medium text-gray-800 mb-3">Available Time Slots</h3>
          <p className="text-gray-600 mb-3">The doctor is available on the following days:</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
            <div className="border border-gray-200 rounded-md p-2 text-center">
              <p className="font-medium text-gray-800">Monday</p>
              <p className="text-sm text-gray-600">9:00 AM - 5:00 PM</p>
            </div>
            <div className="border border-gray-200 rounded-md p-2 text-center">
              <p className="font-medium text-gray-800">Tuesday</p>
              <p className="text-sm text-gray-600">9:00 AM - 5:00 PM</p>
            </div>
            <div className="border border-gray-200 rounded-md p-2 text-center">
              <p className="font-medium text-gray-800">Thursday</p>
              <p className="text-sm text-gray-600">9:00 AM - 5:00 PM</p>
            </div>
            <div className="border border-gray-200 rounded-md p-2 text-center">
              <p className="font-medium text-gray-800">Friday</p>
              <p className="text-sm text-gray-600">9:00 AM - 5:00 PM</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-500">
            * Actual availability may vary. You'll be able to select from available time slots during the booking process.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentSection;