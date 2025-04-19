"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function DoctorCard({ doctor }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      {/* Doctor Image */}
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
        <img
          src={doctor.photoURL || doctor.imageUrl || "https://public.readdy.ai/ai/img_res/44c49570964d9978bef233f93cc1e776.jpg"}
          alt={doctor.displayName || doctor.name}
          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
        />
        {doctor.featured && (
          <div className="absolute top-0 right-0 bg-teal-500 text-white text-xs font-bold px-2 py-1 m-2 rounded">
            Featured
          </div>
        )}
      </div>
      
      {/* Doctor Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-1">{doctor.displayName || doctor.name}</h3>
        
        <div className="flex flex-wrap gap-1 mb-2">
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {doctor.department}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-1">{doctor.degree}</p>
        
        <div className="flex items-center text-gray-600 text-sm mb-4">
          <svg className="w-4 h-4 text-green-600 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
          </svg>
          <span>{doctor.experience} experience</span>
        </div>
        
        {/* Rating - Optional */}
        {doctor.rating && (
          <div className="flex items-center mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(doctor.rating) ? "text-yellow-400" : "text-gray-300"}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({doctor.reviewCount || 0})</span>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="mt-auto pt-4">
          {mounted ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
              <Link href={`/user/doctors/${doctor.uid || doctor.id}`} className="col-span-1">
                <button className="w-full bg-white border border-green-600 text-green-600 hover:bg-green-50 font-medium py-2 px-3 rounded-lg text-sm transition-colors duration-200">
                  View Profile
                </button>
              </Link>
              <Link href={`/user/appointment/booking?doctorId=${doctor.uid || doctor.id}`} className="col-span-1">
                <button className="w-full bg-green-600 text-white hover:bg-green-700 font-medium py-2 px-3 rounded-lg text-sm transition-colors duration-200">
                  Book Now
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
              <div className="col-span-1 w-full bg-white border border-green-600 text-green-600 font-medium py-2 px-3 rounded-lg text-sm text-center">
                Know more
              </div>
              <div className="col-span-1 w-full bg-green-600 text-white font-medium py-2 px-3 rounded-lg text-sm text-center">
                Book Now
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}