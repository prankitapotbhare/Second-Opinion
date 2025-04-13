"use client";
import { useState, useEffect } from "react";
import { doctors } from "@/data/staticData";

export default function DoctorsSection() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12">
          <span className="text-gray-800">Our </span>
          <span className="text-teal-600">Recommended</span>
          <span className="text-gray-800"> Best Doctors...</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {doctors.map((doctor, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 flex items-center">
              <div className="w-32 h-32 overflow-hidden rounded-lg mr-6">
                <img
                  src={doctor.image || "https://public.readdy.ai/ai/img_res/44c49570964d9978bef233f93cc1e776.jpg"}
                  alt={doctor.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-1">{doctor.name}</h3>
                <p className="text-gray-600 mb-1">{doctor.department}</p>
                <p className="text-gray-600 mb-1">{doctor.degree}</p>
                <p className="text-gray-600">Experience: {doctor.experience}</p>
              </div>
              <div className="flex flex-col space-y-3">
                {mounted ? (
                  <>
                    <button className="bg-teal-600 text-white px-4 py-2 rounded text-sm hover:bg-teal-700 transition-colors whitespace-nowrap cursor-pointer">
                      Know More
                    </button>
                    <button className="border border-teal-600 text-teal-600 px-4 py-2 rounded text-sm hover:bg-teal-50 transition-colors whitespace-nowrap cursor-pointer">
                      Book a consultation
                    </button>
                  </>
                ) : (
                  <>
                    <div className="bg-teal-600 text-white px-4 py-2 rounded text-sm whitespace-nowrap">
                      Know More
                    </div>
                    <div className="border border-teal-600 text-teal-600 px-4 py-2 rounded text-sm whitespace-nowrap">
                      Book a consultation
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}