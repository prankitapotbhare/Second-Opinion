"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaUpload, FaTrash } from 'react-icons/fa';
import { usePatient } from '@/contexts/PatientContext';
import { useAuth } from '@/contexts/AuthContext';
import { showSuccessToast, showErrorToast } from '@/utils/toast';

export default function PatientDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('doctorId');
  const { currentUser, loading: authLoading } = useAuth();
  const { submitDetails, patientDetailsLoading, patientDetailsError, currentSubmission } = usePatient();

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

  const TOAST_MESSAGES = {
    MISSING_DOCTOR_ID: 'Doctor information is missing. Please refresh the page or try again.',
    REQUIRED_FIELDS: (fields) => `Please complete all required fields: ${fields.join(', ')}`,
    SUBMIT_SUCCESS: 'Your details have been submitted successfully.',
    SUBMIT_ERROR: 'Something went wrong. Please try again.',
  };

  useEffect(() => {
    if (!authLoading && !currentUser) {
      const returnUrl = `/patient/patient-details?doctorId=${doctorId}`;
      router.push(`/login/patient?redirect=${encodeURIComponent(returnUrl)}`);
    }
  }, [currentUser, authLoading, router, doctorId]);

  useEffect(() => {
    if (currentUser) {
      setFormData(prevData => ({
        ...prevData,
        fullName: currentUser.displayName || '',
        email: currentUser.email || '',
        relation: 'Self'
      }));
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentSubmission) {
      router.push(`/patient/response?submissionId=${currentSubmission._id}`);
    }
  }, [currentSubmission, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === 'age' || name === 'contactNumber' || name === 'emergencyContact') && value !== '') {
      if (name === 'age' && (!/^\d+$/.test(value) || parseInt(value) <= 0)) return;
      if ((name === 'contactNumber' || name === 'emergencyContact') && !/^\d*$/.test(value)) return;
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

  const handleDeleteFile = (index) => {
    setFormData(prev => ({
      ...prev,
      medicalFiles: prev.medicalFiles.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      const returnUrl = `/patient/patient-details?doctorId=${doctorId}`;
      router.push(`/login/patient?redirect=${encodeURIComponent(returnUrl)}`);
      return;
    }

    if (!doctorId) {
      showErrorToast(TOAST_MESSAGES.MISSING_DOCTOR_ID);
      return;
    }

    const requiredFields = ['fullName', 'age', 'gender', 'problem'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      showErrorToast(TOAST_MESSAGES.REQUIRED_FIELDS(missingFields));
      return;
    }

    const result = await submitDetails({ ...formData, doctorId });
    console.log(result);

    if (result.success) {
      showSuccessToast(TOAST_MESSAGES.SUBMIT_SUCCESS);
    } else {
      showErrorToast(result.error || TOAST_MESSAGES.SUBMIT_ERROR);
    }
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
            <label className="block text-gray-700 font-medium mb-1">
              Full Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
              required
              pattern="^\d+$"
              title="Please enter digits only"
            />
          </div>

          {/* Gender */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">Gender<span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-4">
              {['Male', 'Female'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleGenderSelect(g)}
                  className={`px-4 py-3 border rounded-md text-center ${
                    formData.gender === g
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {g}
                </button>
              ))}
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
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 resize-none"
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
                <input type="file" multiple className="hidden" onChange={handleFileUpload} />
              </div>
            </label>

            {formData.medicalFiles.length > 0 && (
              <ul className="mt-2 text-sm text-gray-800 space-y-2">
                {formData.medicalFiles.map((file, index) => (
                  <li key={index} className="flex justify-between items-center p-2 bg-gray-50 border border-gray-200 rounded-md">
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteFile(index)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete file"
                    >
                      <FaTrash size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {isUploading && <p className="mt-2 text-sm text-teal-600">Uploading...</p>}
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2 flex justify-end pt-4">
            <button
              type="submit"
              disabled={patientDetailsLoading}
              className={`px-8 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors ${
                patientDetailsLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {patientDetailsLoading ? 'Submitting...' : 'Submit Documents'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
