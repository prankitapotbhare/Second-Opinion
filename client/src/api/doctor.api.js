/**
 * Doctor API service
 * Handles all doctor-related API calls to the backend
 */

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
 * Helper function to get authentication token
 * @returns {string} Authentication token
 * @throws {Error} If no token is found
 */
const getAuthToken = () => {
  // Try to get token from sessionStorage
  let token = sessionStorage.getItem('authToken');
  
  // If not in sessionStorage, try localStorage as fallback
  if (!token) {
    token = localStorage.getItem('authToken');
  }
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  return token;
};

/**
 * Complete doctor profile
 * @param {Object} profileData - Doctor profile data
 * @param {Object} files - Files to upload (registration certificate, government ID, profile photo)
 * @returns {Promise<Object>} Updated profile data
 */
export const completeProfile = async (profileData, files) => {
  try {
    const token = getAuthToken();
    const formData = new FormData();

    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== undefined && profileData[key] !== null) {
        if (Array.isArray(profileData[key])) {
          // Append each language as its own field
          if (key === 'languages') {
            profileData[key].forEach(lang => {
              formData.append('languages', lang);
            });
          } else {
            formData.append(key, profileData[key]);
          }
        } else {
          formData.append(key, profileData[key]);
        }
      }
    });

    // Add files to FormData if they exist
    if (files) {
      Object.keys(files).forEach(key => {
        if (files[key]) {
          formData.append(key, files[key]);
        }
      });
    }
    
    const response = await fetch(`${API_URL}/doctor/profile/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type here, it will be set automatically with the boundary
      },
      body: formData
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error completing doctor profile:', error);
    throw error;
  }
};

/**
 * Get doctor profile
 * @returns {Promise<Object>} Doctor profile data
 */
export const getDoctorProfile = async () => {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_URL}/doctor/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error getting doctor profile:', error);
    throw error;
  }
};

/**
 * Update doctor profile
 * @param {Object} profileData - Doctor profile data to update
 * @param {Object} files - Files to upload (registration certificate, government ID, profile photo)
 * @returns {Promise<Object>} Updated profile data
 */
export const updateProfile = async (profileData, files) => {
  try {
    const token = getAuthToken();
    const formData = new FormData();

    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== undefined && profileData[key] !== null) {
        if (Array.isArray(profileData[key])) {
          // Append each language as its own field
          if (key === 'languages') {
            profileData[key].forEach(lang => {
              formData.append('languages', lang);
            });
          } else {
            formData.append(key, profileData[key]);
          }
        } else {
          formData.append(key, profileData[key]);
        }
      }
    });

    // Add files to FormData if they exist
    if (files) {
      Object.keys(files).forEach(key => {
        if (files[key]) {
          formData.append(key, files[key]);
        }
      });
    }
    
    const response = await fetch(`${API_URL}/doctor/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type here, it will be set automatically with the boundary
      },
      body: formData
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    throw error;
  }
};

/**
 * Set doctor availability
 * @param {Object} availabilityData - Doctor availability data
 * @returns {Promise<Object>} Availability data
 */
export const setAvailability = async (availabilityData) => {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_URL}/doctor/profile/availability`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(availabilityData)
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error setting doctor availability:', error);
    throw error;
  }
};

/**
 * Get doctor availability
 * @returns {Promise<Object>} Availability data
 */
export const getAvailability = async () => {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_URL}/doctor/profile/availability`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error getting doctor availability:', error);
    throw error;
  }
};

/**
 * Change doctor password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Response data
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_URL}/doctor/change-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

/**
 * Delete doctor account
 * @returns {Promise<Object>} Response data
 */
export const deleteAccount = async () => {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_URL}/doctor/account`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error deleting doctor account:', error);
    throw error;
  }
};

/**
 * Get doctor dashboard statistics
 * @returns {Promise<Object>} Dashboard statistics data
 */
export const getDashboardStats = async () => {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_URL}/doctor/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
};

/**
 * Get doctor reviews (paginated)
 * @param {Object} params - Query parameters (page, limit)
 * @returns {Promise<Object>} Doctor reviews data with pagination
 */
export const getDoctorReviews = async (params = {}) => {
  try {
    const token = getAuthToken();
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await fetch(`${API_URL}/doctor/reviews${queryString}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error getting doctor reviews:', error);
    throw error;
  }
};

/**
 * Get doctor appointments
 * @param {Object} params - Query parameters (status, date, page, limit)
 * @returns {Promise<Object>} Appointments data with pagination
 */
export const getAppointments = async (params = {}) => {
  try {
    const token = getAuthToken();
    
    // Build query string from params
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    const response = await fetch(`${API_URL}/doctor/appointments${queryString}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error getting doctor appointments:', error);
    throw error;
  }
};

/**
 * Get appointment details
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise<Object>} Appointment details
 */
export const getAppointmentDetails = async (appointmentId) => {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_URL}/doctor/appointments/${appointmentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error getting appointment details:', error);
    throw error;
  }
};

/**
 * Submit response to patient appointment
 * @param {string} appointmentId - Appointment ID
 * @param {Object} responseData - Response data (message, secondOpinionRequired)
 * @param {Array} responseFiles - Response files to upload
 * @returns {Promise<Object>} Updated appointment data
 */
export const submitAppointmentResponse = async (appointmentId, responseData, responseFiles = []) => {
  try {
    const token = getAuthToken();
    const formData = new FormData();
    
    // Add response data to form
    Object.keys(responseData).forEach(key => {
      if (responseData[key] !== undefined && responseData[key] !== null) {
        formData.append(key, responseData[key]);
      }
    });
    
    // Add response files if any
    if (responseFiles && responseFiles.length > 0) {
      responseFiles.forEach(file => {
        formData.append('responseFiles', file);
      });
    }
    
    const response = await fetch(`${API_URL}/doctor/appointments/${appointmentId}/response`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type here, it will be set automatically with the boundary
      },
      body: formData
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error submitting appointment response:', error);
    throw error;
  }
};

/**
 * Get patient requests
 * @param {Object} params - Query parameters (page, limit)
 * @returns {Promise<Object>} Patient requests data with pagination
 */
export const getPatientRequests = async (params = {}) => {
  try {
    const token = getAuthToken();
    
    // Build query string from params
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    const response = await fetch(`${API_URL}/doctor/requests${queryString}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error getting patient requests:', error);
    throw error;
  }
};

/**
 * Accept patient request
 * @param {string} requestId - Request ID
 * @returns {Promise<Object>} Updated request data
 */
export const acceptPatientRequest = async (requestId) => {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_URL}/doctor/requests/${requestId}/accept`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error accepting patient request:', error);
    throw error;
  }
};

/**
 * Reject patient request
 * @param {string} requestId - Request ID
 * @returns {Promise<Object>} Updated request data
 */
export const rejectPatientRequest = async (requestId) => {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_URL}/doctor/requests/${requestId}/reject`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error rejecting patient request:', error);
    throw error;
  }
};