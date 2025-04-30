"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  getDoctorResponse, 
  submitFeedback, 
  requestSecondOpinion, 
  checkAppointmentStatus, 
  getDoctors,
  getDoctorById 
} from '@/api/patient.api';

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
  // Core state
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const [doctorResponse, setDoctorResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Doctor state
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [doctorsError, setDoctorsError] = useState(null);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [doctorLoading, setDoctorLoading] = useState(false);
  const [doctorError, setDoctorError] = useState(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalDoctors: 0,
    limit: 8
  });
  
  // Feedback state
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  
  // Appointment state
  const [appointmentRequested, setAppointmentRequested] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [appointmentStatus, setAppointmentStatus] = useState(null); // 'pending', 'approved', 'rejected'
  const [statusCheckInterval, setStatusCheckInterval] = useState(null);

  // Load persisted data on mount
  useEffect(() => {
    loadPersistedData();
  }, []);

  // Load all persisted data from localStorage
  const loadPersistedData = () => {
    try {
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
    } catch (error) {
      console.error('Error loading persisted data:', error);
      setError('Failed to load saved data. Please try refreshing the page.');
    }
  };

  // Check appointment status - memoized with useCallback to prevent recreation on each render
  const checkAppointmentStatusUpdate = useCallback(async () => {
    if (!doctorResponse?.id || !appointmentRequested) return;
    
    try {
      const status = await checkAppointmentStatus(doctorResponse.id);
      
      if (status.status === 'not_found') {
        return;
      }
      
      // Update appointment status
      setAppointmentStatus(status.status);
      localStorage.setItem('appointmentStatus', status.status);
      
      // If approved, update the appointment details with any additional info from doctor
      if (status.status === 'approved' && status.appointmentDetails) {
        const updatedDetails = {...appointmentDetails, ...status.appointmentDetails};
        setAppointmentDetails(updatedDetails);
        localStorage.setItem('appointmentDetails', JSON.stringify(updatedDetails));
      }
      
      // If status is final (approved/rejected), clear the interval
      if (status.status === 'approved' || status.status === 'rejected') {
        if (statusCheckInterval) {
          clearInterval(statusCheckInterval);
          setStatusCheckInterval(null);
        }
      }
    } catch (err) {
      console.error('Error checking appointment status:', err);
    }
  }, [doctorResponse?.id, appointmentRequested, appointmentDetails, statusCheckInterval]);

  // Set up status checking interval when appointment is requested
  useEffect(() => {
    // Only set up interval if appointment is pending and we have a response
    if (appointmentRequested && appointmentStatus === 'pending' && doctorResponse?.id) {
      // Clear any existing interval first to prevent duplicates
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
      
      // Check status immediately
      checkAppointmentStatusUpdate();
      
      // Then set up interval to check every 30 seconds
      const intervalId = setInterval(() => {
        checkAppointmentStatusUpdate();
      }, 30000);
      
      setStatusCheckInterval(intervalId);
      
      // Clean up interval on unmount
      return () => {
        clearInterval(intervalId);
      };
    }
    
    // Clean up interval if appointment is no longer pending
    if (statusCheckInterval && appointmentStatus !== 'pending') {
      clearInterval(statusCheckInterval);
      setStatusCheckInterval(null);
    }
    
  }, [appointmentRequested, appointmentStatus, doctorResponse?.id, statusCheckInterval, checkAppointmentStatusUpdate]);
  
  // Fetch doctors list
  // Only showing the fetchDoctors function update - the rest of the file remains unchanged
  
  // Inside the PatientProvider component:
  
  // Update the fetchDoctors function to handle pagination better
  const fetchDoctors = useCallback(async (params = {}) => {
  // Don't set loading to true if we're just changing pages
  // This prevents the entire list from disappearing during page changes
  const isPageChange = params.page && pagination.currentPage !== params.page;
  
  if (!isPageChange) {
    setDoctorsLoading(true);
  }
  
  setDoctorsError(null);
  
  try {
    const result = await getDoctors(params);
    
    setDoctors(result.doctors);
    setPagination({
      currentPage: parseInt(result.page),
      totalPages: Math.ceil(result.total / result.limit),
      totalDoctors: result.total,
      limit: result.limit
    });
    
    return result;
  } catch (err) {
    console.error('Error fetching doctors:', err);
    setDoctorsError(err.message || 'Failed to fetch doctors');
    return null;
  } finally {
    setDoctorsLoading(false);
  }
  }, [pagination.currentPage]);

  // Fetch doctor by ID with cache control
  const fetchDoctorById = useCallback(async (doctorId, bypassCache = false) => {
    if (!doctorId) {
      setDoctorError("Doctor ID is required");
      return null;
    }
    
    setDoctorLoading(true);
    setDoctorError(null);
    setCurrentDoctor(null);
    
    try {
      const doctor = await getDoctorById(doctorId, bypassCache);
      setCurrentDoctor(doctor);
      return doctor;
    } catch (err) {
      setDoctorError(err.message || "Failed to load doctor details");
      return null;
    } finally {
      setDoctorLoading(false);
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
      setError('Failed to load doctor\'s response. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Set current submission and fetch response
  const setSubmission = (submission) => {
    if (!submission || !submission.id) {
      console.error('Invalid submission data');
      return;
    }
    
    setCurrentSubmission(submission);
    
    // Store submission ID in localStorage for better persistence
    localStorage.setItem('patientSubmissionId', submission.id);
    
    // Fetch doctor's response for this submission
    fetchDoctorResponse(submission.id);
  };

  // Clear all submission and appointment data
  const clearSubmission = () => {
    // Clear state
    setCurrentSubmission(null);
    setDoctorResponse(null);
    setFeedbackSubmitted(false);
    setAppointmentRequested(false);
    setAppointmentDetails(null);
    setAppointmentStatus(null);
    
    // Clear interval if exists
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
      setStatusCheckInterval(null);
    }
    
    // Clear from localStorage
    localStorage.removeItem('patientSubmissionId');
    localStorage.removeItem('feedbackSubmitted');
    localStorage.removeItem('appointmentRequested');
    localStorage.removeItem('appointmentDetails');
    localStorage.removeItem('appointmentStatus');
  };

  // Submit feedback to doctor
  const submitFeedbackToDoctor = async (responseId, rating, comment) => {
    if (!responseId) {
      throw new Error('Response ID is required');
    }
    
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
    if (!responseId) {
      throw new Error('Response ID is required');
    }
    
    if (!dateTime || !dateTime.date || !dateTime.time) {
      throw new Error('Date and time are required');
    }
    
    try {
      const result = await requestSecondOpinion(responseId, dateTime);
      
      // Update state with appointment details
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
    } else {
      console.error('No submission to refresh');
    }
  };

  return (
    <PatientContext.Provider
      value={{
        // Core data
        currentSubmission,
        doctorResponse,
        loading,
        error,
        
        // Doctor data
        doctors,
        doctorsLoading,
        doctorsError,
        fetchDoctors,
        pagination,
        setPagination,
        currentDoctor,
        doctorLoading,
        doctorError,
        
        // Feedback data
        feedbackSubmitted,
        setFeedbackSubmitted,
        
        // Appointment data
        appointmentRequested,
        appointmentDetails,
        appointmentStatus,
        
        // Actions
        setSubmission,
        clearSubmission,
        submitFeedbackToDoctor,
        requestAppointment,
        refreshResponse,
        checkAppointmentStatusUpdate,
        fetchDoctorById,
        refreshDoctorDetails: (doctorId) => fetchDoctorById(doctorId, true), // Method to force refresh
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};