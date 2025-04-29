"use client";
import { useEffect } from "react";
import { usePatient } from "@/contexts/PatientContext";
import DoctorCard from "./DoctorCard";

export default function DoctorsSection() {
  const { doctors, doctorsLoading, doctorsError, fetchDoctors } = usePatient();

  useEffect(() => {
    fetchDoctors(); // Fetch doctors on mount
  }, [fetchDoctors]);

  // Take only the first few doctors for this section, e.g., 6
  const recommendedDoctors = doctors.slice(0, 6);

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-[#F8FAFC] px-4">
      <div className="container mx-auto">
        <div className="text-center sm:text-left mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            <span className="text-gray-800">Our </span>
            <span className="text-teal-600">Recommended </span>
            <span className="text-gray-800">Best Doctors....</span>
          </h2>
        </div>

        {doctorsLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Doctor Image - Square Skeleton */}
                  <div className="w-full sm:w-1/5 max-w-[120px] mx-auto sm:mx-0 aspect-square overflow-hidden flex-shrink-0">
                    <div className="w-full h-full bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                  {/* Doctor Info and Buttons Skeleton */}
                  <div className="flex flex-col sm:flex-row justify-between w-full sm:w-4/5 gap-4">
                    {/* Doctor Info Skeleton */}
                    <div className="flex flex-col justify-center text-center sm:text-left w-full">
                      <div className="h-7 bg-gray-200 rounded w-2/3 mx-auto sm:mx-0 mb-2 animate-pulse"></div>
                      <div className="h-5 bg-gray-100 rounded w-1/2 mx-auto sm:mx-0 mb-1 animate-pulse"></div>
                      <div className="h-5 bg-gray-100 rounded w-1/3 mx-auto sm:mx-0 mb-1 animate-pulse"></div>
                      <div className="h-5 bg-gray-100 rounded w-1/2 mx-auto sm:mx-0 animate-pulse"></div>
                    </div>
                    {/* Action Buttons Skeleton */}
                    <div className="flex flex-col gap-2 justify-center mt-2 sm:mt-0 w-full">
                      <div className="w-full h-9 bg-gray-300 rounded-md animate-pulse"></div>
                      <div className="w-full h-9 bg-gray-200 rounded-md animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : doctorsError ? (
          <div className="text-center text-red-500 py-8">{doctorsError}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {recommendedDoctors.map((doctor) => (
              doctor.id ? (
                <div key={doctor.id}>
                  <DoctorCard doctor={doctor} />
                </div>
              ) : null
            ))}
          </div>
        )}
      </div>
    </section>
  );
}