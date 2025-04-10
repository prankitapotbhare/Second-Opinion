"use client";

import React from 'react';
import FileUpload from './FileUpload';

const EducationalBackgroundForm = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Educational Background</h2>
        <div className="text-green-500 flex items-center">
          <i className="fas fa-check-circle mr-2"></i>
          <span>Changes saved</span>
        </div>
      </div>
      <p className="text-gray-500">
        Share your academic qualifications and certifications.
      </p>
      <div className="space-y-6 mt-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <div className="mb-6">
              <label
                htmlFor="medicalDegree"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Medical Degree <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="medicalDegree"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="MD, MBBS, etc."
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="institution"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Institution <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="institution"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Harvard Medical School"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="graduationYear"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Year of Graduation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="graduationYear"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="2010"
              />
            </div>
            
            <FileUpload
              label="Upload Degree Certificates"
              accept=".pdf,.jpg,.jpeg,.png"
              required={true}
              isDragDrop={true}
              fileTypes="PDF, JPG or PNG (max. 5MB)"
            />
          </div>
          <div className="w-full md:w-1/2">
            <div className="mb-6">
              <label
                htmlFor="additionalCertifications"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Additional Certifications
              </label>
              <textarea
                id="additionalCertifications"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="List any additional certifications or specializations"
              ></textarea>
            </div>
            <div className="mb-6">
              <label
                htmlFor="professionalMembership"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Professional Membership
              </label>
              <textarea
                id="professionalMembership"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="List professional associations or societies you belong to"
              ></textarea>
            </div>
            <div className="mb-6">
              <label
                htmlFor="awardsRecognition"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Awards and Recognition
              </label>
              <textarea
                id="awardsRecognition"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="List any awards, honors or recognition received"
              ></textarea>
            </div>
            <div className="mb-6">
              <label
                htmlFor="publications"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Publications & Research
              </label>
              <textarea
                id="publications"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="List any published papers or research work"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalBackgroundForm; 