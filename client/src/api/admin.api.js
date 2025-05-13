import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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

// Create axios instance with auth token interceptor
const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add auth token to every request
API.interceptors.request.use(
  (config) => {
    try {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error setting auth token:', error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

// Admin statistics
export const getAdminStats = async () => {
  try {
    const response = await API.get('/admin/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch admin statistics' };
  }
};

// Doctor management
export const getAllDoctors = async (page = 1, limit = 10) => {
  try {
    const response = await API.get(`/admin/doctors?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch doctors' };
  }
};

// Patient management
export const getAllPatients = async (page = 1, limit = 10) => {
  try {
    const response = await API.get(`/admin/patients?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch patients' };
  }
};

// Doctor-specific operations
export const getDoctorPatientsExcel = async (doctorId) => {
  try {
    const response = await API.get(`/admin/doctors/${doctorId}/patients-excel`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to download doctor patients Excel' };
  }
};

export const getDoctorInvoicePdf = async (doctorId) => {
  try {
    const response = await API.get(`/admin/doctors/${doctorId}/invoice`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to download doctor invoice PDF' };
  }
};

export const sendDoctorInvoiceEmail = async (doctorId) => {
  try {
    const response = await API.post(`/admin/doctors/${doctorId}/send-invoice`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to send invoice email' };
  }
};