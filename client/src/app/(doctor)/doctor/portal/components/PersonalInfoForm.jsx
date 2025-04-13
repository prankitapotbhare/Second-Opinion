"use client";

import React from 'react';
import FileUpload from './FileUpload';
import DropdownSelect from './DropdownSelect';

const PersonalInfoForm = ({ 
  profileImage, 
  handleImageUpload, 
  gender, 
  setGender 
}) => {
  const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        <div className="text-green-500 flex items-center">
          <i className="fas fa-check-circle mr-2"></i>
        </div>
      </div>
      <p className="text-gray-500">
        Let's get your account up and running.
      </p>
      <div className="space-y-6 mt-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <FileUpload
              label="Profile Picture"
              accept="image/*"
              onChange={handleImageUpload}
              required={true}
              description={
                profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <i className="fas fa-user text-3xl text-gray-400"></i>
                )
              }
            />
            
            <div className="mb-6">
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Dr. John Smith"
              />
            </div>
            
            <DropdownSelect
              label="Gender"
              options={genderOptions}
              value={gender}
              onChange={setGender}
              placeholder="Select gender"
              required={true}
            />
          </div>
          
          <div className="w-full md:w-1/2">
            <div className="mb-6">
              <label
                htmlFor="contactNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="contactNumber"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="doctor@example.com"
              />
            </div>
            
            <div className="mb-6">
              <label
                htmlFor="nationality"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nationality
              </label>
              <input
                type="text"
                id="nationality"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g. American, Canadian, etc."
              />
            </div>
            
            <div className="mb-6">
              <label
                htmlFor="languages"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Languages Spoken <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="languages"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="English, Spanish, etc."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;