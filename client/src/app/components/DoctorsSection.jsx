"use client";
import { useState, useEffect } from "react";
import { doctors } from "@/data/staticData";
import Link from "next/link";

export default function DoctorsSection() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center sm:text-left mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            <span className="text-gray-800">Our </span>
            <span className="text-teal-600">Recommended</span>
            <span className="text-gray-800"> Best Doctors</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {doctors.map((doctor, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Doctor Image - Stacks on mobile, side-by-side on larger screens */}
                <div className="w-full sm:w-1/3 h-48 sm:h-auto overflow-hidden">
                  <img
                    src={doctor.photoURL || doctor.image || "https://public.readdy.ai/ai/img_res/44c49570964d9978bef233f93cc1e776.jpg"}
                    alt={doctor.displayName || doctor.name}
                    className="w-full h-full object-cover object-center sm:object-top"
                  />
                </div>
                
                {/* Doctor Info */}
                <div className="p-4 sm:p-6 flex flex-col sm:w-2/3">
                  <div className="flex-grow">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">{doctor.displayName || doctor.name}</h3>
                    <div className="mb-4">
                      <span className="inline-block bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2 mr-2">
                        {doctor.department}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">{doctor.degree}</p>
                    <p className="text-gray-600 text-sm mb-4">
                      <span className="inline-flex items-center">
                        <svg className="w-4 h-4 text-teal-600 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                        </svg>
                        {doctor.experience} experience
                      </span>
                    </p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col xs:flex-row sm:flex-col gap-2 mt-2">
                    {mounted ? (
                      <>
                        <Link href={`/user/doctors/${doctor.uid || doctor.id || index}`} className="w-full">
                          <button className="w-full bg-teal-600 text-white px-4 py-2 rounded-md text-sm hover:bg-teal-700 transition-colors whitespace-nowrap font-medium">
                            View Profile
                          </button>
                        </Link>
                        <Link href={`/user/appointment/booking?doctorId=${doctor.uid || doctor.id || index}`} className="w-full">
                          <button className="w-full border border-teal-600 text-teal-600 px-4 py-2 rounded-md text-sm hover:bg-teal-50 transition-colors whitespace-nowrap font-medium">
                            Book Consultation
                          </button>
                        </Link>
                      </>
                    ) : (
                      <>
                        <div className="w-full bg-teal-600 text-white px-4 py-2 rounded-md text-sm whitespace-nowrap text-center font-medium">
                          View Profile
                        </div>
                        <div className="w-full border border-teal-600 text-teal-600 px-4 py-2 rounded-md text-sm whitespace-nowrap text-center font-medium">
                          Book Consultation
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}