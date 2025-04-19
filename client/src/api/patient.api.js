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
 * Get doctor's response for a patient submission
 * @param {string} submissionId - ID of the patient submission
 * @returns {Promise<Object>} Doctor's response
 */
export const getDoctorResponse = async (submissionId) => {
  try {
    // For mock implementation, we'll check our mock data first
    const existingResponse = getResponseBySubmissionId(submissionId);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        if (existingResponse) {
          // Return the existing response
          resolve(existingResponse);
        } else {
          // Generate a mock response
          resolve({
            id: 'resp_' + Math.random().toString(36).substr(2, 9),
            submissionId: submissionId,
            requiredSecondOpinion: Math.random() > 0.7, // 30% chance of requiring second opinion
            responseText: "As a precaution, please avoid heavy activities and ensure proper rest. Let's do a detailed evaluation soon. In the meantime, maintain a healthy diet and stay hydrated. If symptoms worsen suddenly, don't hesitate to seek immediate medical attention. Keep a daily log of your symptoms to help us understand any patterns. Avoid screen time and loud environments if they trigger discomfort.",
            documents: [
              { id: 1, name: "File.pdf", url: "/mock-files/file1.pdf" },
              { id: 2, name: "Report.pdf", url: "/mock-files/report1.pdf" },
              { id: 3, name: "File.pdf", url: "/mock-files/file2.pdf" },
              { id: 4, name: "Report.pdf", url: "/mock-files/report2.pdf" }
            ],
            doctorId: "1",
            createdAt: new Date().toISOString()
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
 * Submit patient rating and comment for a doctor's response
 * @param {string} responseId - ID of the doctor's response
 * @param {number} rating - Rating (1-5)
 * @param {string} comment - Patient's comment
 * @returns {Promise<Object>} Submission response
 */
export const submitFeedback = async (responseId, rating, comment) => {
  try {
    // For mock implementation, we'll simulate a successful response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Your feedback has been submitted successfully',
          feedbackId: 'feed_' + Math.random().toString(36).substr(2, 9)
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
 * @returns {Promise<Object>} Appointment request response
 */
export const requestSecondOpinion = async (responseId) => {
  try {
    // For mock implementation, we'll simulate a successful response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Your request for a second opinion has been submitted',
          appointmentId: 'apt_' + Math.random().toString(36).substr(2, 9)
        });
      }, 1000);
    });
  } catch (error) {
    console.error('Error requesting second opinion:', error);
    throw error;
  }
};