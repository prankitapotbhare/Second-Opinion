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
 * Download doctor document
 * @param {string} documentType - Type of document to download (registrationCertificate, governmentId)
 * @returns {Promise<Blob>} Document blob
 */
export const downloadDocument = async (documentType) => {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`${API_URL}/doctor/profile/documents/${documentType}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.message || 'Failed to download document');
      error.status = response.status;
      throw error;
    }
    
    return await response.blob();
  } catch (error) {
    console.error(`Error downloading ${documentType}:`, error);
    throw error;
  }
};