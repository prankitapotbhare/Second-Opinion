"use client";
import { useState, useEffect } from "react";
import { doctors as doctorsData } from "@/data/doctorsData"; // Import the consolidated data
import DoctorCard from "./DoctorCard"; // Import the DoctorCard component

export default function DoctorsSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Take only the first few doctors for this section, e.g., 4
  const recommendedDoctors = doctorsData.slice(0, 4);

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white px-4">
      <div className="container mx-auto">
        <div className="text-center sm:text-left mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            <span className="text-gray-800">Our </span>
            <span className="text-teal-600">Recommended </span>
            <span className="text-gray-800">Best Doctors....</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {recommendedDoctors.map((doctor) => (
            doctor.id ? (
              <div key={doctor.id}>
                <DoctorCard doctor={doctor} />
              </div>
            ) : null
          ))}
        </div>
      </div>
    </section>
  );
}