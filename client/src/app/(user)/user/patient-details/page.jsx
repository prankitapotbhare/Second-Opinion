"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaUpload } from 'react-icons/fa';
import { submitPatientDetails } from '@/api/patient.api';
import { usePatient } from '@/contexts/PatientContext';

export default function PatientDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('doctorId');
  const { setSubmission } = usePatient();
  
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    relation: '',
    contactNumber: '',
    email: '',
    emergencyContact: '',
    gender: '',
    problem: '',
    documents: []
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenderSelect = (gender) => {
    setFormData(prev => ({
      ...prev,
      gender
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setIsUploading(true);
    
    // Simulate file upload process
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...files]
      }));
      setIsUploading(false);
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log('Patient details submitted:', formData);
      
      // Call the API to submit patient details
      const response = await submitPatientDetails(
        {
          fullName: formData.fullName,
          age: formData.age,
          relation: formData.relation,
          contactNumber: formData.contactNumber,
          email: formData.email,
          emergencyContact: formData.emergencyContact,
          gender: formData.gender,
          problem: formData.problem
        },
        formData.documents,
        doctorId
      );
      
      // Store the submission in context
      setSubmission({
        id: response.submissionId,
        doctorId: doctorId
      });
      
      // Redirect to success page instead of directly to responses
      router.push('/user/response');
    } catch (err) {
      console.error('Error submitting patient details:', err);
      setError(err.message || 'Failed to submit patient details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Patient's Details</h1>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="relative">
            <div className="space-y-4">
              {/* Full Name */}
              <div>
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
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              
              {/* Relation with patient */}
              <div>
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
                <input
                  type="tel"
                  name="contactNumber"
                  placeholder="Contact Number"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              
              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              
              {/* Emergency Contact */}
              <div>
                <input
                  type="tel"
                  name="emergencyContact"
                  placeholder="Emergency Contact Number"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
              
              {/* Gender Selection */}
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
              
              {/* Problem Description */}
              <div>
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
              <div>
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
                
                {/* Display uploaded files */}
                {formData.documents.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">Uploaded files:</p>
                    <ul className="text-sm text-gray-800">
                      {formData.documents.map((file, index) => (
                        <li key={index} className="mb-1">
                          {file.name}
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
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Documents'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}