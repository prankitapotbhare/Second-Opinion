"use client";

import React from 'react';
import Link from 'next/link';

export default function AppointmentConfirmation() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <i className="fas fa-check text-2xl text-green-600"></i>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Appointment Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Your appointment has been successfully booked. You will receive a confirmation email with all the details.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Appointment ID:</span>
            <span className="font-medium">APT-12345</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Doctor:</span>
            <span className="font-medium">Dr. Emily Johnson</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Date:</span>
            <span className="font-medium">April 15, 2023</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Time:</span>
            <span className="font-medium">10:30 AM</span>
          </div>
        </div>
        <div className="space-y-3">
          <Link href="/">
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Return to Home
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Go to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}