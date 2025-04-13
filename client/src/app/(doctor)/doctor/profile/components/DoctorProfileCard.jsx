"use client";

import React from 'react';
import Link from 'next/link';

export default function DoctorProfileCard({ doctor, id }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <div className="flex flex-col md:flex-row items-center relative">
        <div className="md:w-1/4 mb-4 md:mb-0">
          <div className="w-60 h-60 rounded-full overflow-hidden mx-auto">
            <img
              src={doctor.imageUrl || "https://public.readdy.ai/ai/img_res/44c49570964d9978bef233f93cc1e776.jpg"}
              alt={doctor.name}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
        <div className="md:w-2/4 md:px-6 flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{doctor.name}</h1>
          <p className="text-lg text-green-600 mb-2">{doctor.department}</p>
          <p className="text-md text-gray-600 mb-2">{doctor.degree}</p>
          <p className="text-md text-gray-600 mb-2">Experience: {doctor.experience}</p>
          <p className="text-md text-gray-600">{doctor.hospital || "Hospital/clinic Affiliation"}</p>
        </div>
        <div className="md:w-1/4 flex flex-col justify-end">
        </div>
        <div className="absolute bottom-0 right-0">
          <Link href={`/appointment-booking/${id}`}>
            <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg shadow-sm transition duration-200 text-md">
              Book a Consultation
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}