"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDoctorResponse } from '@/api/patient.api';

// Create the context
const PatientContext = createContext();

// Custom hook to use the patient context
export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};

export const PatientProvider = ({ children }) => {
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const [doctorResponse, setDoctorResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load submission from sessionStorage on mount
  useEffect(() => {
    const submissionId = sessionStorage.getItem('patientSubmissionId');
    if (submissionId) {
      setCurrentSubmission({ id: submissionId });
      fetchDoctorResponse(submissionId);
    }
  }, []);

  // Fetch doctor's response
  const fetchDoctorResponse = async (submissionId) => {
    if (!submissionId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getDoctorResponse(submissionId);
      setDoctorResponse(response);
    } catch (err) {
      console.error('Error fetching doctor response:', err);
      setError('Failed to load doctor\'s response');
    } finally {
      setLoading(false);
    }
  };

  // Set current submission
  const setSubmission = (submissionData) => {
    setCurrentSubmission(submissionData);
    
    // Store in sessionStorage
    if (submissionData && submissionData.id) {
      sessionStorage.setItem('patientSubmissionId', submissionData.id);
    } else {
      sessionStorage.removeItem('patientSubmissionId');
    }
    
    // Fetch the doctor's response if we have a submission ID
    if (submissionData && submissionData.id) {
      fetchDoctorResponse(submissionData.id);
    }
  };

  // Clear current submission
  const clearSubmission = () => {
    setCurrentSubmission(null);
    setDoctorResponse(null);
    sessionStorage.removeItem('patientSubmissionId');
  };

  // Refresh doctor's response
  const refreshResponse = () => {
    if (currentSubmission && currentSubmission.id) {
      fetchDoctorResponse(currentSubmission.id);
    }
  };

  // Context value
  const value = {
    currentSubmission,
    doctorResponse,
    loading,
    error,
    setSubmission,
    clearSubmission,
    refreshResponse
  };

  return (
    <PatientContext.Provider value={value}>
      {children}
    </PatientContext.Provider>
  );
};