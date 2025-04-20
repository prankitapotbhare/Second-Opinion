"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDoctorResponse, submitFeedback, requestSecondOpinion, checkAppointmentStatus } from '@/api/patient.api';

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
  const [appointmentStatus, setAppointmentStatus] = useState(null); // 'pending', 'approved', 'rejected'

  // Load submission from localStorage on mount for better persistence
  useEffect(() => {
    const submissionId = localStorage.getItem('patientSubmissionId');
    const feedbackStatus = localStorage.getItem('feedbackSubmitted');
    const appointmentStatus = localStorage.getItem('appointmentRequested');
    const appointmentData = localStorage.getItem('appointmentDetails');
    const apptStatus = localStorage.getItem('appointmentStatus');
    
    if (submissionId) {
      setCurrentSubmission({ id: submissionId });
      fetchDoctorResponse(submissionId);
    }
    
    if (feedbackStatus === 'true') {
      setFeedbackSubmitted(true);
    }
    
    if (appointmentStatus === 'true') {
      setAppointmentRequested(true);
    }
    
    if (appointmentData) {
      try {
        setAppointmentDetails(JSON.parse(appointmentData));
      } catch (err) {
        console.error('Error parsing appointment details:', err);
      }
    }
    
    if (apptStatus) {
      setAppointmentStatus(apptStatus);
    }
  }, []);

  // Periodically check appointment status if an appointment has been requested
  useEffect(() => {
    let intervalId;
    
    if (appointmentRequested && appointmentStatus !== 'approved' && appointmentStatus !== 'rejected') {
      // Check status immediately
      checkAppointmentStatusUpdate();
      
      // Then set up interval to check every 30 seconds
      intervalId = setInterval(checkAppointmentStatusUpdate, 30000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [appointmentRequested, appointmentStatus]);

  // Check appointment status
  const checkAppointmentStatusUpdate = async () => {
    if (!doctorResponse || !appointmentRequested) return;
    
    try {
      const status = await checkAppointmentStatus(doctorResponse.id);
      setAppointmentStatus(status.status);
      localStorage.setItem('appointmentStatus', status.status);
      
      // If approved, update the appointment details with any additional info from doctor
      if (status.status === 'approved' && status.appointmentDetails) {
        setAppointmentDetails(prev => ({...prev, ...status.appointmentDetails}));
        localStorage.setItem('appointmentDetails', JSON.stringify({
          ...appointmentDetails,
          ...status.appointmentDetails
        }));
      }
    } catch (err) {
      console.error('Error checking appointment status:', err);
    }
  };

  // Fetch doctor's response
  const fetchDoctorResponse = async (submissionId) => {
    if (!submissionId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getDoctorResponse(submissionId);
      setDoctorResponse(response);
      
      // Check if appointment was already requested in the response
      if (response.appointmentRequested) {
        setAppointmentRequested(true);
        setAppointmentDetails(response.appointmentDetails);
        setAppointmentStatus(response.appointmentStatus || 'pending');
        
        localStorage.setItem('appointmentRequested', 'true');
        localStorage.setItem('appointmentDetails', JSON.stringify(response.appointmentDetails));
        localStorage.setItem('appointmentStatus', response.appointmentStatus || 'pending');
      }
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
      // Store submission ID in localStorage for better persistence
      localStorage.setItem('patientSubmissionId', submission.id);
      
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
    setAppointmentStatus(null);
    
    // Clear from localStorage
    localStorage.removeItem('patientSubmissionId');
    localStorage.removeItem('feedbackSubmitted');
    localStorage.removeItem('appointmentRequested');
    localStorage.removeItem('appointmentDetails');
    localStorage.removeItem('appointmentStatus');
  };

  // Submit feedback to doctor
  const submitFeedbackToDoctor = async (responseId, rating, comment) => {
    try {
      await submitFeedback(responseId, rating, comment);
      setFeedbackSubmitted(true);
      localStorage.setItem('feedbackSubmitted', 'true');
      return true;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  };

  // Request appointment for second opinion
  const requestAppointment = async (responseId, dateTime) => {
    try {
      const result = await requestSecondOpinion(responseId, dateTime);
      setAppointmentRequested(true);
      setAppointmentDetails(dateTime);
      setAppointmentStatus('pending');
      
      // Store in localStorage
      localStorage.setItem('appointmentRequested', 'true');
      localStorage.setItem('appointmentDetails', JSON.stringify(dateTime));
      localStorage.setItem('appointmentStatus', 'pending');
      
      return result;
    } catch (error) {
      console.error('Error requesting appointment:', error);
      throw error;
    }
  };

  // Refresh doctor response data
  const refreshResponse = () => {
    if (currentSubmission && currentSubmission.id) {
      fetchDoctorResponse(currentSubmission.id);
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
        setFeedbackSubmitted,
        appointmentRequested,
        appointmentDetails,
        appointmentStatus,
        setSubmission,
        clearSubmission,
        submitFeedbackToDoctor,
        requestAppointment,
        refreshResponse,
        checkAppointmentStatusUpdate
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};