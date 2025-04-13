"use client";

import React from 'react';

export default function ProfessionalDetails({ doctor }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Professional Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start">
            <i className="fas fa-graduation-cap text-blue-600 mt-1 mr-3"></i>
            <div>
              <p className="font-medium">Qualification</p>
              <p className="text-gray-600">{doctor.degree}</p>
            </div>
          </div>
          <div className="flex items-start">
            <i className="fas fa-id-card text-blue-600 mt-1 mr-3"></i>
            <div>
              <p className="font-medium">License</p>
              <p className="text-gray-600">MCI No: 123456789 <span className="text-green-600 ml-1"><i className="fas fa-check-circle"></i> Verified</span></p>
            </div>
          </div>
          <div className="flex items-start">
            <i className="fas fa-award text-blue-600 mt-1 mr-3"></i>
            <div>
              <p className="font-medium">Award</p>
              <p className="text-gray-600">Excellence in {doctor.department} – 2021</p>
            </div>
          </div>
          <div className="flex items-start">
            <i className="fas fa-language text-blue-600 mt-1 mr-3"></i>
            <div>
              <p className="font-medium">Languages</p>
              <p className="text-gray-600">English, Hindi</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-start">
            <i className="fas fa-calendar-alt text-blue-600 mt-1 mr-3"></i>
            <div>
              <p className="font-medium">Availability</p>
              <p className="text-gray-600">Mon – Sat, 10:00 AM – 6:00 PM</p>
            </div>
          </div>
          <div className="flex items-start">
            <i className="fas fa-video text-blue-600 mt-1 mr-3"></i>
            <div>
              <p className="font-medium">Consult Options</p>
              <p className="text-gray-600">Video Call, Chat, In-Person Visit</p>
            </div>
          </div>
          <div className="flex items-start">
            <i className="fas fa-star text-blue-600 mt-1 mr-3"></i>
            <div>
              <p className="font-medium">Reviews</p>
              <p className="text-gray-600">
                <span className="text-yellow-500">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star-half-alt"></i>
                </span>
                <span className="ml-1">4.9/5 (500+ Patient Reviews)</span>
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <i className="fas fa-map-marker-alt text-blue-600 mt-1 mr-3"></i>
            <div>
              <p className="font-medium">Address</p>
              <p className="text-gray-600">{doctor.hospital || "Medical Center"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}