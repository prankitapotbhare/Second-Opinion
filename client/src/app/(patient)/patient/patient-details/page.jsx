"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaUpload, FaTrash } from 'react-icons/fa'; // Updated import to include FaTrash
import { usePatient } from '@/contexts/PatientContext';
import { useAuth } from '@/contexts/AuthContext';

export default function PatientDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('doctorId');
  const { currentUser } = useAuth();
  const { 
    submitDetails, 
    patientDetailsLoading, 
    patientDetailsError, 
    currentSubmission 
  } = usePatient();

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    relation: 'Self',
    contactNumber: '',
    email: '',
    emergencyContact: '',
    gender: '',
    problem: '',
    medicalFiles: []
  });

  const [isUploading, setIsUploading] = useState(false);

  // Autofill form with user data when component mounts
  useEffect(() => {
    if (currentUser) {
      setFormData(prevData => ({
        ...prevData,
        fullName: currentUser.displayName || '',
        email: currentUser.email || '',
        // Set relation to "Self" if the user is filling out their own details
        relation: 'Self'
      }));
    }
  }, [currentUser]);

  // Redirect to response page if submission is successful
  useEffect(() => {
    if (currentSubmission) {
      router.push(`/patient/response?submissionId=${currentSubmission._id}`);
    }
  }, [currentSubmission, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate numeric inputs
    if ((name === 'age' || name === 'contactNumber' || name === 'emergencyContact') && value !== '') {
      // For age, only allow positive numbers
      if (name === 'age' && (!/^\d+$/.test(value) || parseInt(value) <= 0)) {
        return;
      }
      // For contact numbers, only allow digits
      if ((name === 'contactNumber' || name === 'emergencyContact') && !/^\d*$/.test(value)) {
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderSelect = (gender) => {
    setFormData(prev => ({ ...prev, gender }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setIsUploading(true);

    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        medicalFiles: [...prev.medicalFiles, ...files]
      }));
      setIsUploading(false);
    }, 1000);
  };

  // Add this function to handle file deletion
  const handleDeleteFile = (index) => {
    setFormData(prev => ({
      ...prev,
      medicalFiles: prev.medicalFiles.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!doctorId) {
      alert("Doctor ID is required. Please select a doctor first.");
      return;
    }

    const patientDetails = {
      doctorId,
      fullName: formData.fullName,
      age: formData.age,
      relation: formData.relation,
      contactNumber: formData.contactNumber,
      email: formData.email,
      gender: formData.gender,
      emergencyContact: formData.emergencyContact,
      problem: formData.problem,
      medicalFiles: formData.medicalFiles
    };

    await submitDetails(patientDetails);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Patient's Details</h1>

        {patientDetailsError && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
            {patientDetailsError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Age<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              pattern="^[1-9][0-9]*$"
              title="Please enter a positive number"
            />
          </div>

          {/* Relation */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Relation with Patient<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="relation"
              placeholder="Your relation with patient"
              value={formData.relation}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Contact Number<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="contactNumber"
              placeholder="+91 1234567890"
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              pattern="^\d+$"
              title="Please enter digits only"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email<span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Emergency Contact Number<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="emergencyContact"
              placeholder="+91 9876543210"
              value={formData.emergencyContact}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
              pattern="^\d+$"
              title="Please enter digits only"
            />
          </div>

          {/* Gender */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">Gender<span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleGenderSelect('Male')}
                className={`px-4 py-3 border rounded-md text-center ${
                  formData.gender === 'Male'
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => handleGenderSelect('Female')}
                className={`px-4 py-3 border rounded-md text-center ${
                  formData.gender === 'Female'
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          {/* Problem */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">Problem Description<span className="text-red-500">*</span></label>
            <textarea
              name="problem"
              placeholder="Write your problem"
              value={formData.problem}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              required
            ></textarea>
          </div>

          {/* Document Upload */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">Upload Documents (if any)</label>
            <label className="block w-full cursor-pointer">
              <div className="flex items-center justify-center w-full px-4 py-6 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <FaUpload className="mr-2 text-teal-600" />
                <span>Upload Your Documents</span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </label>

            {formData.medicalFiles.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Uploaded files:</p>
                <ul className="text-sm text-gray-800">
                  {formData.medicalFiles.map((file, index) => (
                    <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200 mb-2">
                      <span>{file.name}</span>
                      <button 
                        type="button"
                        onClick={() => handleDeleteFile(index)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-gray-200 transition-colors"
                        title="Delete file"
                      >
                        <FaTrash size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {isUploading && (
              <div className="mt-2">
                <p className="text-sm text-teal-600">Uploading...</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2 flex justify-end pt-4">
            <button
              type="submit"
              disabled={patientDetailsLoading}
              className={`px-8 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors ${patientDetailsLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {patientDetailsLoading ? 'Submitting...' : 'Submit Documents'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
