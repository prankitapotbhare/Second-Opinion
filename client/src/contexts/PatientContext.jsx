"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  getDoctors,
  getDoctorById,
  submitPatientDetails,
  checkAppointmentStatus,
  requestAppointment
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Doctor state
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [doctorsError, setDoctorsError] = useState(null);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [doctorLoading, setDoctorLoading] = useState(false);
  const [doctorError, setDoctorError] = useState(null);
  
  // Patient details state
  const [patientDetailsLoading, setPatientDetailsLoading] = useState(false);
  const [patientDetailsError, setPatientDetailsError] = useState(null);
  const [currentSubmission, setCurrentSubmission] = useState(null);
  
  // Appointment state
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [appointmentError, setAppointmentError] = useState(null);
  const [appointmentStatus, setAppointmentStatus] = useState(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalDoctors: 0,
    limit: 8
  });

  // Fetch doctors list
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

  // Submit patient details to a doctor
  const submitDetails = useCallback(async (patientDetails) => {
    if (!patientDetails || !patientDetails.doctorId) {
      setPatientDetailsError("Doctor ID and patient details are required");
      return null;
    }
    
    // Validate required fields
    if (!patientDetails.fullName || !patientDetails.age || !patientDetails.relation || 
        !patientDetails.contactNumber || !patientDetails.email || !patientDetails.gender || 
        !patientDetails.problem) {
      setPatientDetailsError("All required fields must be filled");
      return null;
    }
    
    setPatientDetailsLoading(true);
    setPatientDetailsError(null);
    setCurrentSubmission(null);
    
    try {
      const result = await submitPatientDetails(patientDetails);
      setCurrentSubmission(result.data.formSubmission);
      return result.data.formSubmission;
    } catch (err) {
      const errorMessage = err.data?.message || err.message || "Failed to submit patient details";
      setPatientDetailsError(errorMessage);
      return null;
    } finally {
      setPatientDetailsLoading(false);
    }
  }, []);

  // Check appointment status
  const checkStatus = useCallback(async (submissionId) => {
    if (!submissionId) {
      setAppointmentError("Submission ID is required");
      return null;
    }
    
    setAppointmentLoading(true);
    setAppointmentError(null);
    
    try {
      const result = await checkAppointmentStatus(submissionId);
      setAppointmentStatus(result.data);
      return result.data;
    } catch (err) {
      const errorMessage = err.data?.message || err.message || "Failed to check appointment status";
      setAppointmentError(errorMessage);
      return null;
    } finally {
      setAppointmentLoading(false);
    }
  }, []);

  // Request appointment
  const requestDoctorAppointment = useCallback(async (submissionId, appointmentDetails) => {
    if (!submissionId || !appointmentDetails) {
      setAppointmentError("Submission ID and appointment details are required");
      return null;
    }
    
    setAppointmentLoading(true);
    setAppointmentError(null);
    
    try {
      const result = await requestAppointment(submissionId, appointmentDetails);
      setAppointmentStatus(result.data);
      return result.data;
    } catch (err) {
      const errorMessage = err.data?.message || err.message || "Failed to request appointment";
      setAppointmentError(errorMessage);
      return null;
    } finally {
      setAppointmentLoading(false);
    }
  }, []);

  return (
    <PatientContext.Provider
      value={{
        // Core data
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
        fetchDoctorById,
        refreshDoctorDetails: (doctorId) => fetchDoctorById(doctorId, true), // Method to force refresh
        
        // Patient details data
        patientDetailsLoading,
        patientDetailsError,
        currentSubmission,
        submitDetails,
        
        // Appointment data
        appointmentLoading,
        appointmentError,
        appointmentStatus,
        checkStatus,
        requestDoctorAppointment,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};