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
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Doctor Image - Square */}
        <div className="w-full sm:w-1/5 max-w-[120px] mx-auto sm:mx-0 aspect-square overflow-hidden flex-shrink-0">
          <img
            src={doctor.imageUrl || defaultImage}
            alt={doctor.name || 'Doctor'}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Doctor Info and Buttons Container */}
        <div className="flex flex-col sm:flex-row justify-between w-full sm:w-4/5 gap-4">
          {/* Doctor Info */}
          <div className="flex flex-col justify-center text-center sm:text-left">
            {/* Doctor Name */}
            <h3 className="text-xl font-bold text-gray-800">{doctor.name || 'Dr. Anonymous'}</h3>
            
            {/* Specialization */}
            {doctor.specialization && (
              <p className="text-gray-600 mt-1">{doctor.specialization}</p>
            )}
            
            {/* Qualification */}
            {(doctor.degree || doctor.qualification) && (
              <p className="text-gray-600 mt-1">{doctor.degree || doctor.qualification}</p>
            )}
            
            {/* Experience */}
            {doctor.experience && (
              <p className="text-gray-600 mt-1">Experience: {doctor.experience}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 justify-center mt-2 sm:mt-0">
            {mounted ? (
              <>
                <Link href={`/user/doctors/${doctor.id}`} className="w-full">
                  <button className="w-full bg-teal-600 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-700 transition-colors font-medium">
                    Know More
                  </button>
                </Link>
                <Link href={`/user/patient-details?doctorId=${doctor.id}`} className="w-full">
                  <button className="w-full border border-teal-600 text-teal-600 px-4 py-2 rounded-md text-sm hover:bg-teal-50 transition-colors font-medium">
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