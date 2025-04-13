"use client";

import React from 'react';

export default function AboutDoctor({ doctor }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        {doctor.name} is a dedicated {doctor.department} specialist with over {doctor.experience} of experience in diagnosing and treating a wide range of conditions. They currently practice at {doctor.hospital || "a leading medical center"}, where they have established themselves as a trusted healthcare provider known for their patient-centered approach and clinical excellence.
      </p>
      <p className="text-gray-700 leading-relaxed">
        After completing their {doctor.degree}, {doctor.name.split(' ')[1]} pursued specialized training in {doctor.department}, where they gained extensive knowledge in advanced procedures and treatments. Their educational background and continuous professional development have equipped them with the skills necessary to address complex issues with precision and care.
      </p>
    </div>
  );
}