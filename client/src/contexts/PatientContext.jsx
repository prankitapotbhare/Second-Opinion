"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDoctorResponse, submitFeedback, requestSecondOpinion } from '@/api/patient.api';

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
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [appointmentRequested, setAppointmentRequested] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);

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
  const setSubmission = (submission) => {
    setCurrentSubmission(submission);
    
    if (submission && submission.id) {
      // Store submission ID in sessionStorage for persistence
      sessionStorage.setItem('patientSubmissionId', submission.id);
      
      // Fetch doctor's response for this submission
      fetchDoctorResponse(submission.id);
    }
  };

  // Clear current submission
  const clearSubmission = () => {
    setCurrentSubmission(null);
    setDoctorResponse(null);
    setFeedbackSubmitted(false);
    setAppointmentRequested(false);
    setAppointmentDetails(null);
    sessionStorage.removeItem('patientSubmissionId');
  };

  // Submit feedback
  const submitFeedbackToDoctor = async (responseId, rating, comment) => {
    try {
      await submitFeedback(responseId, rating, comment);
      setFeedbackSubmitted(true);
      return true;
    } catch (err) {
      console.error('Error submitting feedback:', err);
      return false;
    }
  };

  // Request second opinion appointment
  const requestAppointment = async (responseId, dateTimeDetails) => {
    try {
      const response = await requestSecondOpinion(responseId, dateTimeDetails);
      setAppointmentRequested(true);
      setAppointmentDetails(dateTimeDetails);
      return response;
    } catch (err) {
      console.error('Error requesting appointment:', err);
      throw err;
    }
  };

  return (
    <PatientContext.Provider
      value={{
        currentSubmission,
        doctorResponse,
        loading,
        error,
        feedbackSubmitted,
        appointmentRequested,
        appointmentDetails,
        setSubmission,
        clearSubmission,
        submitFeedbackToDoctor,
        requestAppointment,
        setFeedbackSubmitted,
        setAppointmentRequested,
        setAppointmentDetails
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};