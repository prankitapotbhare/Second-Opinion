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
 * Submit patient details and documents
 * @param {Object} patientData - Patient details
 * @param {Array} documents - Array of document files
 * @param {string} doctorId - ID of the doctor
 * @returns {Promise<Object>} Submission response
 */
export const submitPatientDetails = async (patientData, documents, doctorId) => {
  try {
    // For mock implementation, we'll simulate a successful response
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create a new submission ID
        const submissionId = 'sub_' + Math.random().toString(36).substr(2, 9);
        
        resolve({
          success: true,
          message: 'Your document has been successfully submitted, wait for response',
          submissionId: submissionId
        });
      }, 1500);
    });
  } catch (error) {
    console.error('Error submitting patient details:', error);
    throw error;
  }
};

/**
 * Get doctor's response for a submission
 * @param {string} submissionId - ID of the patient submission
 * @returns {Promise<Object>} Doctor's response
 */
export const getDoctorResponse = async (submissionId) => {
  try {
    // For mock implementation, we'll use the mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = getResponseBySubmissionId(submissionId);
        if (response) {
          resolve(response);
        } else {
          // If no response found, create a mock response
          resolve({
            id: 'resp_' + Math.random().toString(36).substr(2, 9),
            submissionId: submissionId,
            requiredSecondOpinion: true, // Set to true to test the second opinion flow
            responseText: "Based on your symptoms and the provided documents, I recommend a second opinion. Please schedule an appointment at your earliest convenience so we can discuss your condition in more detail. In the meantime, continue with your current medications and avoid strenuous activities.",
            documents: [
              { id: 1, name: "Prescription.pdf", url: "/mock-files/prescription.pdf" },
              { id: 2, name: "Treatment_Plan.pdf", url: "/mock-files/treatment_plan.pdf" },
              { id: 3, name: "Medical_Report.pdf", url: "/mock-files/medical_report.pdf" }
            ]
          });
        }
      }, 1000);
    });
  } catch (error) {
    console.error('Error getting doctor response:', error);
    throw error;
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
  try {
    // For mock implementation, we'll simulate a successful response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Your feedback has been submitted successfully',
          feedbackId: 'feed_' + Math.random().toString(36).substr(2, 9),
          responseId,
          rating,
          comment
        });
      }, 800);
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

/**
 * Request a second opinion appointment
 * @param {string} responseId - ID of the doctor's response
 * @param {Object} appointmentDetails - Date and time for the appointment
 * @returns {Promise<Object>} Appointment request response
 */
export const requestSecondOpinion = async (responseId, appointmentDetails) => {
  try {
    // For mock implementation, we'll simulate a successful response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Your appointment request has been submitted successfully',
          appointmentId: 'appt_' + Math.random().toString(36).substr(2, 9),
          appointmentDetails,
          status: 'approved'
        });
      }, 800);
    });
  } catch (error) {
    console.error('Error requesting second opinion:', error);
    throw error;
  }
};