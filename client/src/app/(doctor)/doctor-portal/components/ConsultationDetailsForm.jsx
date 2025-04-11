"use client";

import React from 'react';

const ConsultationDetailsForm = ({ consultationModes, handleConsultationModeChange }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Consultation Details</h2>
      <p className="text-gray-500">
        Set up your consultation preferences and availability.
      </p>
      <div className="space-y-6 mt-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Available Consultation Modes{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="writtenReport"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                    checked={consultationModes.writtenReport}
                    onChange={() => handleConsultationModeChange("writtenReport")}
                  />
                  <label
                    htmlFor="writtenReport"
                    className="ml-2 block text-sm text-gray-700 cursor-pointer"
                  >
                    Written Report
                  </label>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opening & Closing Time{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="openingTime"
                    className="block text-xs text-gray-500 mb-1"
                  >
                    Opening Time
                  </label>
                  <input
                    type="time"
                    id="openingTime"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="closingTime"
                    className="block text-xs text-gray-500 mb-1"
                  >
                    Closing Time
                  </label>
                  <input
                    type="time"
                    id="closingTime"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Break Time{" "}
                <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="breakStart"
                    className="block text-xs text-gray-500 mb-1"
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="breakStart"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="breakEnd"
                    className="block text-xs text-gray-500 mb-1"
                  >
                    End Time
                  </label>
                  <input
                    type="time"
                    id="breakEnd"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="responseTime"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Response Time{" "}
                <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <select
                id="responseTime"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select response time</option>
                <option value="within1hour">Within 1 hour</option>
                <option value="within3hours">Within 3 hours</option>
                <option value="within6hours">Within 6 hours</option>
                <option value="within12hours">Within 12 hours</option>
                <option value="within24hours">Within 24 hours</option>
                <option value="within48hours">Within 48 hours</option>
              </select>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="mb-6">
              <label
                htmlFor="availability"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Availability & Working Hours{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="availability"
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Monday: 9 AM - 5 PM&#10;Tuesday: 9 AM - 5 PM&#10;Wednesday: 9 AM - 5 PM&#10;Thursday: 9 AM - 5 PM&#10;Friday: 9 AM - 5 PM"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetailsForm;