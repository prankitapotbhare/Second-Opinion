"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function DoctorCard({ doctor }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default image if imageUrl is missing
  const defaultImage = "https://public.readdy.ai/ai/img_res/44c49570964d9978bef233f93cc1e776.jpg";

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Doctor Image - Square on all screen sizes */}
        <div className="w-full sm:w-1/3 aspect-square overflow-hidden flex-shrink-0">
          <img
            src={doctor.imageUrl || defaultImage}
            alt={doctor.name || 'Doctor'}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Doctor Info */}
        <div className="p-4 sm:p-6 flex flex-col sm:w-2/3">
          <div className="flex-grow">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{doctor.name || 'Dr. Anonymous'}</h3>
            <div className="mb-4">
              {doctor.specialization && (
                <span className="inline-block bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2 mr-2">
                  {doctor.specialization}
                </span>
              )}
            </div>
            {(doctor.degree || doctor.qualification) && (
              <p className="text-gray-600 text-sm mb-1">{doctor.degree || doctor.qualification}</p>
            )}
            {doctor.experience && (
              <p className="text-gray-600 text-sm mb-4">
                <span className="inline-flex items-center">
                  <svg className="w-4 h-4 text-teal-600 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                  </svg>
                  {doctor.experience} experience
                </span>
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col xs:flex-row sm:flex-col gap-2 mt-2">
            {mounted ? (
              <>
                <Link href={`/user/doctors/${doctor.id}`} className="w-full">
                  <button className="w-full bg-teal-600 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-700 transition-colors whitespace-nowrap font-medium">
                    Know more
                  </button>
                </Link>
                <Link href={`/user/appointment/booking?doctorId=${doctor.id}`} className="w-full">
                  <button className="w-full border border-teal-600 text-teal-600 px-4 py-2 rounded-md text-sm hover:bg-teal-50 transition-colors whitespace-nowrap font-medium">
                    Book a consultant
                  </button>
                </Link>
              </>
            ) : (
              <>
                <div className="w-full h-9 bg-gray-300 rounded-md animate-pulse"></div>
                <div className="w-full h-9 bg-gray-200 rounded-md animate-pulse"></div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}