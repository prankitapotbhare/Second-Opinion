// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
"use client";
import React, { useState } from 'react';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const doctors = [
    {
      id: 1,
      name: 'Dr. Sunilkumar',
      specialization: 'Neurology',
      qualification: 'M.B.B.S',
      experience: '4 years',
      imageUrl: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20confident%20male%20doctor%20wearing%20a%20white%20coat%20and%20stethoscope%2C%20modern%20medical%20office%20background%2C%20high%20quality%20professional%20headshot&width=200&height=200&seq=1&orientation=squarish'
    },
    {
      id: 2,
      name: 'Dr. Rincy paulin',
      specialization: 'Cardiology',
      qualification: 'M.D.',
      experience: '6 years',
      imageUrl: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20a%20female%20doctor%20in%20white%20coat%20with%20stethoscope%2C%20modern%20medical%20office%20background%2C%20warm%20and%20friendly%20expression%2C%20high%20quality%20professional%20headshot&width=200&height=200&seq=2&orientation=squarish'
    },
    {
      id: 3,
      name: 'Dr. Preethi',
      specialization: 'Pediatrics',
      qualification: 'M.B.B.S',
      experience: '5 years',
      imageUrl: 'https://readdy.ai/api/search-image?query=professional%20female%20doctor%20portrait%20in%20clinical%20setting%2C%20wearing%20white%20coat%2C%20confident%20pose%2C%20modern%20medical%20background%2C%20high%20quality%20professional%20headshot&width=200&height=200&seq=3&orientation=squarish'
    },
    {
      id: 4,
      name: 'Dr. Anil Kumar',
      specialization: 'Orthopedics',
      qualification: 'M.S.',
      experience: '8 years',
      imageUrl: 'https://readdy.ai/api/search-image?query=professional%20male%20doctor%20portrait%20in%20modern%20hospital%20setting%2C%20wearing%20white%20coat%20and%20stethoscope%2C%20friendly%20smile%2C%20high%20quality%20professional%20headshot&width=200&height=200&seq=4&orientation=squarish'
    },
    {
      id: 5,
      name: 'Dr. Sarah Johnson',
      specialization: 'Dermatology',
      qualification: 'M.D.',
      experience: '7 years',
      imageUrl: 'https://readdy.ai/api/search-image?query=professional%20female%20doctor%20portrait%20with%20gentle%20smile%2C%20dermatologist%20in%20clinical%20environment%2C%20modern%20medical%20setting%2C%20high%20quality%20professional%20headshot&width=200&height=200&seq=5&orientation=squarish'
    },
    {
      id: 6,
      name: 'Dr. Michael Chen',
      specialization: 'Ophthalmology',
      qualification: 'M.S.',
      experience: '9 years',
      imageUrl: 'https://readdy.ai/api/search-image?query=asian%20male%20doctor%20portrait%20wearing%20glasses%20and%20white%20coat%2C%20professional%20medical%20setting%2C%20confident%20pose%2C%20high%20quality%20professional%20headshot&width=200&height=200&seq=6&orientation=squarish'
    },
    {
      id: 7,
      name: 'Dr. Emma Wilson',
      specialization: 'Psychiatry',
      qualification: 'M.D.',
      experience: '6 years',
      imageUrl: 'https://readdy.ai/api/search-image?query=warm%20and%20approachable%20female%20psychiatrist%20portrait%20in%20professional%20setting%2C%20wearing%20formal%20attire%2C%20compassionate%20expression%2C%20high%20quality%20professional%20headshot&width=200&height=200&seq=7&orientation=squarish'
    },
    {
      id: 8,
      name: 'Dr. James Anderson',
      specialization: 'ENT',
      qualification: 'M.S.',
      experience: '10 years',
      imageUrl: 'https://readdy.ai/api/search-image?query=distinguished%20male%20ENT%20specialist%20portrait%20in%20medical%20office%2C%20wearing%20white%20coat%2C%20professional%20demeanor%2C%20high%20quality%20professional%20headshot&width=200&height=200&seq=8&orientation=squarish'
    },
    {
      id: 9,
      name: 'Dr. Lisa Martinez',
      specialization: 'Gynecology',
      qualification: 'M.D.',
      experience: '8 years',
      imageUrl: 'https://readdy.ai/api/search-image?query=professional%20female%20gynecologist%20portrait%20with%20welcoming%20smile%2C%20modern%20medical%20facility%20background%2C%20caring%20expression%2C%20high%20quality%20professional%20headshot&width=200&height=200&seq=9&orientation=squarish'
    },
    {
      id: 10,
      name: 'Dr. Robert Thompson',
      specialization: 'Internal Medicine',
      qualification: 'M.D.',
      experience: '12 years',
      imageUrl: 'https://readdy.ai/api/search-image?query=experienced%20male%20internal%20medicine%20physician%20portrait%2C%20sophisticated%20medical%20office%20setting%2C%20trustworthy%20appearance%2C%20high%20quality%20professional%20headshot&width=200&height=200&seq=10&orientation=squarish'
    },
    {
      id: 11,
      name: 'Dr. Maria Garcia',
      specialization: 'Endocrinology',
      qualification: 'M.D.',
      experience: '7 years',
      imageUrl: 'https://readdy.ai/api/search-image?query=latina%20female%20endocrinologist%20portrait%20in%20clinical%20environment%2C%20professional%20attire%2C%20warm%20smile%2C%20high%20quality%20professional%20headshot&width=200&height=200&seq=11&orientation=squarish'
    },
    {
      id: 12,
      name: 'Dr. David Kim',
      specialization: 'Gastroenterology',
      qualification: 'M.D.',
      experience: '9 years',
      imageUrl: 'https://readdy.ai/api/search-image?query=asian%20male%20gastroenterologist%20portrait%20in%20modern%20hospital%20setting%2C%20professional%20medical%20attire%2C%20confident%20pose%2C%20high%20quality%20professional%20headshot&width=200&height=200&seq=12&orientation=squarish'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-gray-800">
                <span className="text-[#2F8C7F]">Second</span> opinion
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
              <button className="bg-[#2F8C7F] text-white px-4 py-2 rounded-lg hover:bg-[#267a6f] transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer">
                Contact us
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            className="w-full p-4 pl-12 text-gray-900 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2F8C7F] focus:border-transparent"
            placeholder="Search Doctor"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <i className="fas fa-search text-gray-400"></i>
          </div>
        </div>
      </div>
      
      {/* Doctors Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctors.slice(0, 8).map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-6">
              <img
                src={doctor.imageUrl}
                alt={doctor.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                <p className="text-gray-600">{doctor.specialization}</p>
                <p className="text-gray-600">{doctor.qualification}</p>
                <p className="text-gray-600">Experience: {doctor.experience}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <button className="bg-[#2F8C7F] text-white px-6 py-2 rounded-lg hover:bg-[#267a6f] transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer">
                  Know More
                </button>
                <button className="bg-[#2F8C7F] text-white px-6 py-2 rounded-lg hover:bg-[#267a6f] transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <button className="bg-[#2F8C7F] text-white px-8 py-3 rounded-lg hover:bg-[#267a6f] transition-colors duration-200 text-lg font-semibold !rounded-button whitespace-nowrap cursor-pointer">
            See All Doctors
          </button>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-[#2F8C7F] text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Second Opinion</h2>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-gray-200">
                  <i className="fab fa-linkedin text-2xl"></i>
                </a>
                <a href="#" className="text-white hover:text-gray-200">
                  <i className="fab fa-twitter text-2xl"></i>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <p className="mb-2">
                <i className="fas fa-phone mr-2"></i>
                +91 657357459465
              </p>
              <p>
                <i className="fas fa-envelope mr-2"></i>
                Secop@gmail.com
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Social Media</h3>
              <p className="mb-2">LinkedIn</p>
              <p>Twitter</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support Hours</h3>
              <p className="mb-2">Available 24/7</p>
              <p className="font-semibold mb-2">Priority Support:</p>
              <p>For urgent medical inquiries responds within 2 hours.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
