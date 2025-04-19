"use client";

import React, { useState } from 'react';
import FileUpload from './FileUpload';
import DropdownSelect from './DropdownSelect';

const DoctorDetailsForm = () => {
  const [specialization, setSpecialization] = useState('');
  
  const specializationOptions = [
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Gastroenterology",
    "Neurology",
    "Oncology",
    "Orthopedics",
    "Pediatrics", 
    "Psychiatry",
    "Radiology",
    "Surgery",
    "Urology",
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto my-4 bg-white p-8 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold">Doctor's Details</h2>
      </div>
      
      <div className="space-y-6">
        <div className="border-b pb-4">
          <p className="text-gray-700 font-medium mb-4">Professional Information:-</p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                Specialization:<span className="text-red-500">*</span>
              </label>
              <DropdownSelect
                options={specializationOptions}
                value={specialization}
                onChange={setSpecialization}
                placeholder="Eg. Cardiology"
                required={true}
              />
            </div>
            
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                Years of Experience:<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="experience"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Eg. 5 (in years)"
              />
            </div>
            
            <div>
              <label htmlFor="hospitalAffiliation" className="block text-sm font-medium text-gray-700 mb-1">
                Current Hospital/Clinic Affiliation:<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="hospitalAffiliation"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Eg. Apollo Hospitals, Chennai"
              />
            </div>
            
            <div>
              <label htmlFor="hospitalAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Hospital Address:
              </label>
              <input
                type="text"
                id="hospitalAddress"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Eg. AIIMS, Delhi, India"
              />
            </div>
            
            <div>
              <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Medical License Number:<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="licenseNumber"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Eg. 4456748"
              />
            </div>
            
            <div>
              <label htmlFor="issuingMedicalCouncil" className="block text-sm font-medium text-gray-700 mb-1">
                Issuing Medical Council:<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="issuingMedicalCouncil"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Eg. Medical Council of India (MCI) / USMLE (USA)"
              />
            </div>
            
            <div>
              <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700 mb-1">
                Consultation Fee:<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="consultationFee"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder=""
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration Certificate Upload:<span className="text-red-500">*</span>
              </label>
              <FileUpload
                accept=".pdf,.jpg,.jpeg,.png"
                required={true}
                isDragDrop={true}
                fileTypes="PDF, JPG or PNG (max. 5MB)"
                placeholder="Upload PDF/JPG"
              />
            </div>
            
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone number:<span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Eg. 9843XXXXXX"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address:<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Eg. sunilkumar@gmail.com"
              />
            </div>
            
            <div>
              <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Contact number:<span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="emergencyContact"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Eg. 7843XXXXXX"
              />
            </div>
            
            <div>
              <label htmlFor="consultationAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Consultation Address:
              </label>
              <input
                type="text"
                id="consultationAddress"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Eg. Fortis Hospital, Bandra, Mumbai"
              />
            </div>
            
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio:
              </label>
              <textarea
                id="bio"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Eg. I am one of the best doctor in the world."
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default DoctorDetailsForm;