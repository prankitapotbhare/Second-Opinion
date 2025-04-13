"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function DoctorCard({ doctor }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-w-[280px] bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
      <div className="h-64 overflow-hidden">
        <img
          src={doctor.imageUrl || "https://public.readdy.ai/ai/img_res/44c49570964d9978bef233f93cc1e776.jpg"}
          alt={doctor.name}
          className="w-full h-full object-cover object-top"
        />
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-bold text-xl text-gray-800">{doctor.name}</h3>
        <div className="flex items-center mt-1 mb-2">
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {doctor.department}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-1">{doctor.degree}</p>
        <p className="text-gray-600 text-sm mb-4">
          <i className="fas fa-clock text-green-600 mr-1"></i> {doctor.experience}
          experience
        </p>
        {mounted ? (
          <div className="mt-auto flex flex-col space-y-2">
            <Link href={`/doctor-profile/${doctor.id}`}>
              <button className="w-full bg-white border border-green-600 text-green-600 hover:bg-green-50 font-medium py-2 px-4 rounded-lg">
                View Profile
              </button>
            </Link>
            <Link href={`/appointment-booking/${doctor.id}`}>
              <button className="w-full bg-green-600 text-white hover:bg-green-700 font-medium py-2 px-4 rounded-lg">
                Book Consultation
              </button>
            </Link>
          </div>
        ) : (
          <div className="mt-auto bg-white border border-green-600 text-green-600 font-medium py-2 px-4 rounded-lg">
            View Profile
          </div>
        )}
      </div>
    </div>
  );
}