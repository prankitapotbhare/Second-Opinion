import React from 'react';

// About Section Component
const AboutSection = ({ doctor }) => (
  <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">About</h2>
    <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
      {doctor.about}
    </div>
  </div>
);

export default AboutSection;