"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  getDoctors,
  getDoctorById,
  submitPatientDetails,
  requestAppointment,
  getDoctorReviews,
  submitReview,
  getPatientResponse,
  getAvailableTimeSlots // Add this import
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
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalDoctors: 0,
    limit: 8
  });

  // Response state
  const [patientResponse, setPatientResponse] = useState(null);
  const [responseLoading, setResponseLoading] = useState(false);
  const [responseError, setResponseError] = useState(null);
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [reviewsPagination, setReviewsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0,
    limit: 10
  });
  
  // Review submission state
  const [reviewSubmitLoading, setReviewSubmitLoading] = useState(false);
  const [reviewSubmitError, setReviewSubmitError] = useState(null);
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState(false);

  // Fetch doctors list
  const fetchDoctors = useCallback(async (params = {}) => {
    // Don't set loading to true if we're just changing pages
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
  
  // Helper function to format status text for UI
  const formatStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending Review';
      case 'opinion-needed':
        return 'Second Opinion Needed';
      case 'opinion-not-needed':
        return 'Second Opinion Not Needed';
      case 'under-review':
        return 'Appointment Under Review';
      case 'approved':
        return 'Appointment Approved';
      case 'rejected':
        return 'Appointment Rejected';
      case 'completed':
        return 'Appointment Completed';
      default:
        return 'Unknown Status';
    }
  };
  
  // Helper function to get status color for UI
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'opinion-needed':
        return 'blue';
      case 'opinion-not-needed':
        return 'gray';
      case 'under-review':
        return 'purple';
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      case 'completed':
        return 'green';
      default:
        return 'gray';
    }
  };
  
  // Helper function to format date
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get patient response
  const fetchPatientResponse = useCallback(async () => {
    setResponseLoading(true);
    setResponseError(null);
    
    try {
      const result = await getPatientResponse();
      
      // Format status for UI display
      const formattedResponse = {
        ...result,
        statusText: formatStatusText(result.status),
        statusColor: getStatusColor(result.status),
        formattedDate: result.appointmentDetails?.date ? 
          formatDate(result.appointmentDetails.date) : null,
        formattedTime: result.appointmentDetails?.time || null,
        isActionable: ['opinion-needed', 'pending'].includes(result.status)
      };
      
      setPatientResponse(formattedResponse);
      return formattedResponse;
    } catch (err) {
      const errorMessage = err.message || "Failed to get patient response";
      setResponseError(errorMessage);
      return null;
    } finally {
      setResponseLoading(false);
    }
  }, []);

  // Available slots state
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);

  // Add this new function
  const fetchAvailableSlots = useCallback(async (doctorId, date) => {
    if (!doctorId || !date) {
      console.error('Missing required parameters:', { doctorId, date });
      setSlotsError("Doctor ID and date are required");
      return [];
    }
    
    setSlotsLoading(true);
    setSlotsError(null);
    setAvailableSlots([]);
    
    try {
      console.log('Calling getAvailableTimeSlots with:', { doctorId, date });
      const slots = await getAvailableTimeSlots(doctorId, date);
      console.log('Fetched slots:', slots);
      
      // Format slots for display (e.g., "09:00" to "09:00 A.M")
      const formattedSlots = slots.map(slot => {
        const [hours, minutes] = slot.split(':').map(Number);
        const period = hours >= 12 ? 'P.M' : 'A.M';
        const displayHours = hours % 12 || 12;
        return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
      });
      
      console.log('Formatted slots:', formattedSlots);
      setAvailableSlots(formattedSlots);
      return formattedSlots;
    } catch (err) {
      console.error('Error fetching available slots:', err);
      setSlotsError(err.message || "Failed to load available slots");
      return [];
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  // Request appointment
  const requestDoctorAppointment = useCallback(async (submissionId, appointmentDetails) => {
    if (!submissionId || !appointmentDetails) {
      setAppointmentError("Submission ID and appointment details are required");
      return null;
    }
    
    if (!appointmentDetails.date || !appointmentDetails.time) {
      setAppointmentError("Date and time are required");
      return null;
    }
    
    setAppointmentLoading(true);
    setAppointmentError(null);
    
    try {
      const result = await requestAppointment(submissionId, appointmentDetails);
      
      // Update the patient response with the new data
      await fetchPatientResponse();
      
      return result.data;
    } catch (err) {
      const errorMessage = err.data?.message || err.message || "Failed to request appointment";
      setAppointmentError(errorMessage);
      return null;
    } finally {
      setAppointmentLoading(false);
    }
  }, [fetchPatientResponse]);
  
  // Fetch doctor reviews
  const fetchDoctorReviews = useCallback(async (doctorId, params = {}) => {
    if (!doctorId) {
      setReviewsError("Doctor ID is required");
      return null;
    }
    
    // Don't set loading to true if we're just changing pages
    const isPageChange = params.page && reviewsPagination.currentPage !== params.page;
    
    if (!isPageChange) {
      setReviewsLoading(true);
    }
    
    setReviewsError(null);
    
    try {
      const result = await getDoctorReviews(doctorId, params);
      
      setReviews(result.reviews);
      setReviewsPagination({
        currentPage: parseInt(result.page),
        totalPages: result.totalPages,
        totalReviews: result.totalReviews,
        limit: result.limit
      });
      
      return result;
    } catch (err) {
      console.error('Error fetching doctor reviews:', err);
      setReviewsError(err.message || 'Failed to fetch doctor reviews');
      return null;
    } finally {
      setReviewsLoading(false);
    }
  }, [reviewsPagination.currentPage]);

  // Submit a review for a doctor
  const submitDoctorReview = useCallback(async (submissionId, reviewData) => {
    if (!submissionId) {
      setReviewSubmitError("Submission ID is required");
      return null;
    }
    
    if (!reviewData.rating || !reviewData.comment) {
      setReviewSubmitError("Rating and comment are required");
      return null;
    }
    
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      setReviewSubmitError("Rating must be between 1 and 5");
      return null;
    }
    
    setReviewSubmitLoading(true);
    setReviewSubmitError(null);
    setReviewSubmitSuccess(false);
    
    try {
      const result = await submitReview(submissionId, reviewData);
      setReviewSubmitSuccess(true);
      
      // If we have the current doctor loaded, refresh the reviews
      if (currentDoctor) {
        fetchDoctorReviews(currentDoctor.id);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err.data?.message || err.message || "Failed to submit review";
      setReviewSubmitError(errorMessage);
      return null;
    } finally {
      setReviewSubmitLoading(false);
    }
  }, [currentDoctor, fetchDoctorReviews]);

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
        refreshDoctorDetails: (doctorId) => fetchDoctorById(doctorId, true),
        
        // Patient details data
        patientDetailsLoading,
        patientDetailsError,
        currentSubmission,
        submitDetails,

        // Response data
        patientResponse,
        responseLoading,
        responseError,
        fetchPatientResponse,

        // Time slots data
        availableSlots,
        slotsLoading,
        slotsError,
        fetchAvailableSlots,
        
        // Appointment data
        appointmentLoading,
        appointmentError,
        requestDoctorAppointment,
        
        // Reviews data
        reviews,
        reviewsLoading,
        reviewsError,
        reviewsPagination,
        fetchDoctorReviews,
        averageRating: reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0,
        
        // Review submission data
        reviewSubmitLoading,
        reviewSubmitError,
        reviewSubmitSuccess,
        submitDoctorReview,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};