/**
 * Patient API service
 * Handles all patient-related API calls to the backend
 */

import { getResponseBySubmissionId } from '@/data/patientData';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Helper function to handle API responses
 * @param {Response} response - Fetch API response
 * @returns {Promise<Object>} Parsed response data
 */
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong');
    error.response = response;
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
};


/**
 * Get list of doctors (public)
 * @param {Object} params - { location, department, limit, page }
 * @returns {Promise<Array>} List of doctors
 */
export const getDoctors = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${API_URL}/doctors${query ? `?${query}` : ""}`;
  const response = await fetch(url);
  const data = await handleResponse(response);
  // Map _id to id for frontend consistency
  return (data.data || []).map(doc => ({
    id: doc._id,
    name: doc.name,
    specialization: doc.specialization,
    degree: doc.degree,
    experience: doc.experience,
  }));
};

/**
 * Helper function to create a mock delay
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Submit patient details and documents
 * @param {Object} patientData - Patient details
 * @param {Array} documents - Array of document files
 * @param {string} doctorId - ID of the doctor
 * @returns {Promise<Object>} Submission response
 */
export const submitPatientDetails = async (patientData, documents, doctorId) => {
  if (!patientData || !doctorId) {
    throw new Error('Patient data and doctor ID are required');
  }
  
  try {
    // For mock implementation, we'll simulate a successful response
    await delay(1500);
    
    // Create a new submission ID
    const submissionId = 'sub_' + Math.random().toString(36).substr(2, 9);
    
    // Store the submission data in localStorage for mock purposes
    const submissionData = {
      id: submissionId,
      patientData,
      documents: documents?.map(doc => ({ name: doc.name, size: doc.size })) || [],
      doctorId,
      submittedAt: new Date().toISOString(),
      status: 'pending' // Initial status is pending
    };
    
    // Store in localStorage for mock persistence
    localStorage.setItem(`submission_${submissionId}`, JSON.stringify(submissionData));
    
    return {
      success: true,
      message: 'Your document has been successfully submitted, wait for response',
      submissionId: submissionId
    };
  } catch (error) {
    console.error('Error submitting patient details:', error);
    throw new Error(error.message || 'Failed to submit patient details');
  }
};

/**
 * Get doctor's response for a submission
 * @param {string} submissionId - ID of the patient submission
 * @returns {Promise<Object>} Doctor's response
 */
export const getDoctorResponse = async (submissionId) => {
  if (!submissionId) {
    throw new Error('Submission ID is required');
  }
  
  try {
    await delay(1000);
    
    // Check if we have a stored response in localStorage
    const storedResponse = localStorage.getItem(`response_${submissionId}`);
    
    if (storedResponse) {
      return JSON.parse(storedResponse);
    }
    
    // Try to get from mock data
    const response = getResponseBySubmissionId(submissionId);
    if (response) {
      return response;
    }
    
    // If no response found, create a mock response
    // Randomly decide if second opinion is required (for testing purposes)
    const requiresSecondOpinion = Math.random() > 0.5;
    
    const mockResponse = {
      id: 'resp_' + Math.random().toString(36).substr(2, 9),
      submissionId: submissionId,
      requiredSecondOpinion: requiresSecondOpinion,
      responseText: requiresSecondOpinion 
        ? "Based on your symptoms and the provided documents, I recommend a second opinion. Please schedule an appointment at your earliest convenience so we can discuss your condition in more detail. In the meantime, continue with your current medications and avoid strenuous activities."
        : "After reviewing your medical records and symptoms, I don't believe a second opinion is necessary at this time. Your current treatment plan appears appropriate for your condition. Continue with the prescribed medications and follow up with your primary physician as scheduled. If symptoms worsen, please contact your doctor immediately.",
      documents: [
        { id: 1, name: "Prescription.pdf", url: "/mock-files/prescription.pdf" },
        { id: 2, name: "Treatment_Plan.pdf", url: "/mock-files/treatment_plan.pdf" },
        { id: 3, name: "Medical_Report.pdf", url: "/mock-files/medical_report.pdf" }
      ],
      createdAt: new Date().toISOString()
    };
    
    // Store the mock response in localStorage for persistence
    localStorage.setItem(`response_${submissionId}`, JSON.stringify(mockResponse));
    
    return mockResponse;
  } catch (error) {
    console.error('Error getting doctor response:', error);
    throw new Error(error.message || 'Failed to get doctor response');
  }
};

/**
 * Submit feedback for a doctor's response
 * @param {string} responseId - ID of the doctor's response
 * @param {number} rating - Rating (1-5)
 * @param {string} comment - Comment text
 * @returns {Promise<Object>} Feedback submission response
 */
export const submitFeedback = async (responseId, rating, comment) => {
  if (!responseId) {
    throw new Error('Response ID is required');
  }
  
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }
  
  try {
    await delay(800);
    
    const feedbackId = 'feed_' + Math.random().toString(36).substr(2, 9);
    
    // Store feedback in localStorage for mock persistence
    const feedbackData = {
      id: feedbackId,
      responseId,
      rating,
      comment,
      submittedAt: new Date().toISOString()
    };
    
    localStorage.setItem(`feedback_${feedbackId}`, JSON.stringify(feedbackData));
    
    return {
      success: true,
      message: 'Your feedback has been submitted successfully',
      feedbackId,
      responseId,
      rating,
      comment
    };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw new Error(error.message || 'Failed to submit feedback');
  }
};

/**
 * Request a second opinion appointment
 * @param {string} responseId - ID of the doctor's response
 * @param {Object} appointmentDetails - Date and time for the appointment
 * @returns {Promise<Object>} Appointment request response
 */
export const requestSecondOpinion = async (responseId, appointmentDetails) => {
  if (!responseId) {
    throw new Error('Response ID is required');
  }
  
  if (!appointmentDetails || !appointmentDetails.date || !appointmentDetails.time) {
    throw new Error('Date and time are required for appointment');
  }
  
  try {
    await delay(800);
    
    const appointmentId = 'appt_' + Math.random().toString(36).substr(2, 9);
    
    // Store appointment request in localStorage for mock persistence
    const appointmentData = {
      id: appointmentId,
      responseId,
      appointmentDetails,
      requestedAt: new Date().toISOString(),
      status: 'pending' // Initial status is pending
    };
    
    localStorage.setItem(`appointment_${appointmentId}`, JSON.stringify(appointmentData));
    localStorage.setItem(`appointment_for_response_${responseId}`, appointmentId);
    
    return {
      success: true,
      message: 'Your appointment request has been submitted successfully',
      appointmentId,
      appointmentDetails,
      status: 'pending'
    };
  } catch (error) {
    console.error('Error requesting second opinion:', error);
    throw new Error(error.message || 'Failed to request appointment');
  }
};

/**
 * Check the status of an appointment request
 * @param {string} responseId - ID of the doctor's response
 * @returns {Promise<Object>} Appointment status
 */
export const checkAppointmentStatus = async (responseId) => {
  if (!responseId) {
    throw new Error('Response ID is required');
  }
  
  try {
    await delay(800);
    
    // Get the appointment ID for this response
    const appointmentId = localStorage.getItem(`appointment_for_response_${responseId}`);
    
    if (!appointmentId) {
      return { status: 'not_found' };
    }
    
    // Get the appointment data
    const appointmentDataStr = localStorage.getItem(`appointment_${appointmentId}`);
    
    if (!appointmentDataStr) {
      return { status: 'not_found' };
    }
    
    const appointmentData = JSON.parse(appointmentDataStr);
    
    // For mock purposes, we'll randomly approve or reject the appointment
    // In a real app, this would come from the backend
    if (appointmentData.status === 'pending') {
      // 80% chance of approval for testing purposes
      const random = Math.random();
      const newStatus = random < 0.6 ? 'pending' : (random < 0.8 ? 'approved' : 'rejected');
      
      // Update the appointment status
      appointmentData.status = newStatus;
      appointmentData.updatedAt = new Date().toISOString();
      
      if (newStatus === 'approved') {
        appointmentData.doctorNotes = "Looking forward to our appointment. Please bring any new test results.";
      } else {
        appointmentData.rejectionReason = "Unable to accommodate at the requested time. Please select a different time.";
      }
      
      // Save the updated appointment data
      localStorage.setItem(`appointment_${appointmentId}`, JSON.stringify(appointmentData));
    }
    
    return {
      status: appointmentData.status,
      appointmentId,
      appointmentDetails: appointmentData.appointmentDetails,
      updatedAt: appointmentData.updatedAt,
      doctorNotes: appointmentData.doctorNotes,
      rejectionReason: appointmentData.rejectionReason
    };
  } catch (error) {
    console.error('Error checking appointment status:', error);
    throw new Error(error.message || 'Failed to check appointment status');
  }
};