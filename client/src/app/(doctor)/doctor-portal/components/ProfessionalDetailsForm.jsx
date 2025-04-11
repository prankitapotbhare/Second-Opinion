"use client";

import React from 'react';
import DropdownSelect from './DropdownSelect';
import FileUpload from './FileUpload';

const ProfessionalDetailsForm = ({ specialization, setSpecialization }) => {
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
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Professional Details</h2>
      <p className="text-gray-500">
        Tell us about your medical qualifications and experience.
      </p>
      <div className="space-y-6 mt-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <div className="mb-6">
              <label
                htmlFor="licenseNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Medical License Number{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="licenseNumber"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="ML12345678"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="issuingMedicalCouncil"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Issuing Medical Council{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="issuingMedicalCouncil"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g. American Medical Association"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="licenseExpiryDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Medical License Expiry Date{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="licenseExpiryDate"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <FileUpload
              label="Upload License Document"
              accept=".pdf,.jpg,.jpeg,.png"
              required={true}
              isDragDrop={true}
              fileTypes="PDF, JPG or PNG (max. 5MB)"
            />
            
            <DropdownSelect
              label="Specialization"
              options={specializationOptions}
              value={specialization}
              onChange={setSpecialization}
              placeholder="Select specialization"
              required={true}
              maxHeight="60"
            />
            
            <div className="mb-6">
              <label
                htmlFor="subSpecialization"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Sub-Specialization
              </label>
              <input
                type="text"
                id="subSpecialization"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g. Interventional Cardiology"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="mb-6">
              <label
                htmlFor="experience"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Years of Experience{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="experience"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="10"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="previousWorkExperience"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Previous Work Experience
              </label>
              <textarea
                id="previousWorkExperience"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe your previous work experience"
              ></textarea>
            </div>
            <div className="mb-6">
              <label
                htmlFor="affiliations"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Affiliated Hospitals/Clinics{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="affiliations"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="List your current hospital affiliations"
              ></textarea>
            </div>
            <div className="mb-6">
              <label
                htmlFor="hospitalAddress"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Hospital Address
              </label>
              <textarea
                id="hospitalAddress"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your primary hospital address"
              ></textarea>
            </div>
            <div className="mb-6">
              <label
                htmlFor="consultationAddress"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Consultation Address
              </label>
              <textarea
                id="consultationAddress"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your consultation clinic address if different from hospital"
              ></textarea>
            </div>
            <div className="mb-6">
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Professional Bio
              </label>
              <textarea
                id="bio"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Brief overview of your expertise and achievements"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDetailsForm; 