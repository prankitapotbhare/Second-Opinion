"use client";

import React from 'react';
import FileUpload from './FileUpload';

const OtherInformationForm = ({ governmentDocument, handleDocumentUpload }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Other Information</h2>
        <div className="text-green-500 flex items-center">
          <i className="fas fa-check-circle mr-2"></i>
          <span>Changes saved</span>
        </div>
      </div>
      <p className="text-gray-500">
        Additional information to complete your profile.
      </p>
      <div className="space-y-6 mt-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <div className="mb-6">
              <label
                htmlFor="governmentDocument"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Upload Government Document{" "}
                <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 ml-1">
                  (Aadhar, PAN Card, Passport)
                </span>
              </label>
              <div className="mt-2">
                {governmentDocument ? (
                  <div className="relative">
                    <div className="border border-gray-300 rounded-md p-2 flex items-center">
                      <i className="fas fa-file-pdf text-red-500 text-xl mr-2"></i>
                      <span className="text-sm truncate">
                        Document uploaded
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDocumentUpload(null)}
                        className="ml-auto text-gray-400 hover:text-gray-600"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                ) : (
                  <FileUpload
                    label=""
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleDocumentUpload}
                    required={true}
                    isDragDrop={true}
                    fileTypes="PDF, JPG or PNG (max. 5MB)"
                  />
                )}
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="whyChooseYou"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Why Should Patients Choose You?{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="whyChooseYou"
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe what makes you unique as a healthcare provider and why patients should choose you for their care."
              ></textarea>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="mb-6">
              <label
                htmlFor="patientMessage"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Personal Patient-Centric Message{" "}
                <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <textarea
                id="patientMessage"
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Share a personal message to your patients about your approach to care and what they can expect when consulting with you."
              ></textarea>
              <p className="mt-2 text-xs text-gray-500">
                This message will be displayed on your public profile to
                help patients connect with you on a more personal level.
              </p>
            </div>
            <div className="mb-6">
              <label
                htmlFor="additionalInfo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Any Additional Information{" "}
                <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <textarea
                id="additionalInfo"
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Any other information you would like to share that wasn't covered in the previous sections."
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherInformationForm; 