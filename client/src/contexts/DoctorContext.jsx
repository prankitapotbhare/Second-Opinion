"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  completeProfile,
  getDoctorProfile, 
  updateProfile, 
  setAvailability, 
  getAvailability,
  changePassword,
  deleteAccount,
  getDashboardStats,
  getDoctorReviews,
  getAppointments,
  getAppointmentDetails,
  submitAppointmentResponse,
  getPatientRequests,
  acceptPatientRequest,
  rejectPatientRequest
} from '@/api/doctor.api';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';

const DoctorContext = createContext();

export const DoctorProvider = ({ children }) => {
  const { currentUser, authToken, logout } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availability, setAvailabilityState] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10
  });
  const [patientRequests, setPatientRequests] = useState([]);
  const [requestsPagination, setRequestsPagination] = useState({
    total: 0,
    page: 1,
    limit: 10
  });
  const router = useRouter();

  // Fetch doctor profile when authenticated
  useEffect(() => {
    if (currentUser && authToken && currentUser.role === 'doctor') {
      fetchDoctorProfile();
    }
  }, [currentUser, authToken]);

  // Complete doctor profile
  const handleCompleteProfile = async (profileData, files) => {
    setLoading(true);
    setError(null);
    try {
      // Check if user is authenticated before proceeding
      if (!currentUser || !authToken) {
        throw new Error('You must be logged in to complete your profile');
      }
      
      // Ensure languages is an array
      if (profileData.languages && typeof profileData.languages === 'string') {
        profileData.languages = profileData.languages.split(',').map(lang => lang.trim()).filter(Boolean);
      }
      
      const response = await completeProfile(profileData, files);
      setDoctor(response.data);
      return response;
    } catch (err) {
      // Handle authentication errors specifically
      if (err.message === 'No authentication token found') {
        setError('Your session has expired. Please log in again.');
        // Optionally redirect to login
        setTimeout(() => {
          if (logout) logout();
          router.push('/login/doctor');
        }, 3000);
      } else {
        setError(err.message || 'Failed to complete profile');
      }
      console.error('Error completing profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctor profile
  const fetchDoctorProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDoctorProfile();
      setDoctor(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch doctor profile');
      console.error('Error fetching doctor profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update doctor profile
  const handleUpdateProfile = async (profileData, files) => {
    setLoading(true);
    setError(null);
    try {
      // Ensure languages is an array
      if (profileData.languages && typeof profileData.languages === 'string') {
        profileData.languages = profileData.languages.split(',').map(lang => lang.trim()).filter(Boolean);
      }
      const response = await updateProfile(profileData, files);
      setDoctor(response.data);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      console.error('Error updating profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Set doctor availability
  const handleSetAvailability = async (availabilityData) => {
    setLoading(true);
    setError(null);
    try {
      // Check if user is authenticated before proceeding
      if (!currentUser || !authToken) {
        throw new Error('You must be logged in to set availability');
      }
      
      const response = await setAvailability(availabilityData);
      setAvailabilityState(response.data);
      return response.data;
    } catch (err) {
      // Handle authentication errors specifically
      if (err.message === 'No authentication token found') {
        setError('Your session has expired. Please log in again.');
        // Optionally redirect to login
        setTimeout(() => {
          if (logout) logout();
          router.push('/login/doctor');
        }, 3000);
      } else {
        setError(err.message || 'Failed to set availability');
      }
      console.error('Error setting availability:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get doctor availability
  const fetchAvailability = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAvailability();
      setAvailabilityState(response.data);
      return response.data;
    } catch (err) {
      // Only set error if it's not a 404 (no availability found yet)
      if (err.status !== 404) {
        setError(err.message || 'Failed to fetch availability');
        console.error('Error fetching availability:', err);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Change doctor password
  const handleChangePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      // Check if user is authenticated before proceeding
      if (!currentUser || !authToken) {
        throw new Error('You must be logged in to change your password');
      }
      
      const response = await changePassword(currentPassword, newPassword);
      return response;
    } catch (err) {
      // Handle authentication errors specifically
      if (err.message === 'No authentication token found') {
        setError('Your session has expired. Please log in again.');
        // Optionally redirect to login
        setTimeout(() => {
          if (logout) logout();
          router.push('/login/doctor');
        }, 3000);
      } else {
        setError(err.message || 'Failed to change password');
      }
      console.error('Error changing password:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete doctor account
  const handleDeleteAccount = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteAccount();
      setDoctor(null);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to delete account');
      console.error('Error deleting account:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get dashboard statistics
  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      // Check if user is authenticated before proceeding
      if (!currentUser || !authToken) {
        throw new Error('You must be logged in to view dashboard statistics');
      }
      
      const response = await getDashboardStats();
      setDashboardStats(response.data);
      return response.data;
    } catch (err) {
      // Handle authentication errors specifically
      if (err.message === 'No authentication token found') {
        setError('Your session has expired. Please log in again.');
        // Optionally redirect to login
        setTimeout(() => {
          if (logout) logout();
          router.push('/login/doctor');
        }, 3000);
      } else {
        setError(err.message || 'Failed to fetch dashboard statistics');
      }
      console.error('Error fetching dashboard statistics:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get doctor reviews (paginated)
  const fetchDoctorReviews = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      if (!currentUser || !authToken) {
        throw new Error('You must be logged in to view reviews');
      }
      const response = await getDoctorReviews(params);
      setReviews(response.data);
      return response;
    } catch (err) {
      if (err.message === 'No authentication token found') {
        setError('Your session has expired. Please log in again.');
        setTimeout(() => {
          if (logout) logout();
          router.push('/login/doctor');
        }, 3000);
      } else {
        setError(err.message || 'Failed to fetch reviews');
      }
      console.error('Error fetching reviews:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get doctor appointments
  const fetchAppointments = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      // Check if user is authenticated before proceeding
      if (!currentUser || !authToken) {
        throw new Error('You must be logged in to view appointments');
      }
      
      // Handle 'all' status filter
      if (params.status === 'all') {
        delete params.status;
      }
      
      const response = await getAppointments(params);
      
      if (response && response.data) {
        setAppointments(response.data);
        setPagination({
          total: response.total || 0,
          page: response.page || 1,
          limit: response.limit || 10
        });
      } else {
        setAppointments([]);
        setPagination({
          total: 0,
          page: 1,
          limit: 10
        });
      }
      
      return response;
    } catch (err) {
      // Handle authentication errors specifically
      if (err.message === 'No authentication token found') {
        setError('Your session has expired. Please log in again.');
        // Optionally redirect to login
        setTimeout(() => {
          if (logout) logout();
          router.push('/login/doctor');
        }, 3000);
      } else {
        setError(err.message || 'Failed to fetch appointments');
      }
      console.error('Error fetching appointments:', err);
      setAppointments([]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add this function to fetch appointment details
  const fetchAppointmentDetails = async (appointmentId) => {
    setLoading(true);
    setError(null);
    try {
      // Check if user is authenticated before proceeding
      if (!currentUser || !authToken) {
        throw new Error('You must be logged in to view appointment details');
      }
      
      const response = await getAppointmentDetails(appointmentId);
      setAppointmentDetails(response.data);
      return response;
    } catch (err) {
      if (err.message === 'No authentication token found') {
        setError('Your session has expired. Please log in again.');
        setTimeout(() => {
          if (logout) logout();
          router.push('/login/doctor');
        }, 3000);
      } else {
        setError(err.message || 'Failed to fetch appointment details');
      }
      console.error('Error fetching appointment details:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Submit response to patient appointment
  // Add this function to the DoctorContext
  const handleSubmitAppointmentResponse = async (appointmentId, responseData) => {
    setLoading(true);
    setError(null);
    try {
      // Check if user is authenticated before proceeding
      if (!currentUser || !authToken) {
        throw new Error('You must be logged in to submit a response');
      }
      
      // First check if the appointment exists and has 'pending' status
      const appointment = await getAppointmentDetails(appointmentId);
      if (!appointment || !appointment.data || appointment.data.status !== 'pending') {
        throw new Error('Appointment not found or not in pending status');
      }
      
      const formData = new FormData();
      formData.append('message', responseData.message);
      formData.append('secondOpinionRequired', responseData.secondOpinionRequired);
      
      // Add file if provided
      if (responseData.file) {
        formData.append('responseFiles', responseData.file);
      }
      
      const response = await submitAppointmentResponse(appointmentId, formData);
      
      // Refresh appointments after successful submission
      await fetchAppointments({ page: pagination.page, limit: pagination.limit });
      
      return response;
    } catch (err) {
      if (err.message === 'No authentication token found') {
        setError('Your session has expired. Please log in again.');
        setTimeout(() => {
          if (logout) logout();
          router.push('/login/doctor');
        }, 3000);
      } else {
        setError(err.message || 'Failed to submit response');
      }
      console.error('Error submitting response:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Get patient requests
  const fetchPatientRequests = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      // Check if user is authenticated before proceeding
      if (!currentUser || !authToken) {
        throw new Error('You must be logged in to view patient requests');
      }
      
      const response = await getPatientRequests(params);
      setPatientRequests(response.data);
      setRequestsPagination({
        total: response.total || 0,
        page: response.page || 1,
        limit: response.limit || 10
      });
      return response;
    } catch (err) {
      // Handle authentication errors specifically
      if (err.message === 'No authentication token found') {
        setError('Your session has expired. Please log in again.');
        // Optionally redirect to login
        setTimeout(() => {
          if (logout) logout();
          router.push('/login/doctor');
        }, 3000);
      } else {
        setError(err.message || 'Failed to fetch patient requests');
      }
      console.error('Error fetching patient requests:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Accept patient request
  const handleAcceptRequest = async (requestId) => {
    setLoading(true);
    setError(null);
    try {
      // Check if user is authenticated before proceeding
      if (!currentUser || !authToken) {
        throw new Error('You must be logged in to accept a request');
      }
      
      const response = await acceptPatientRequest(requestId);
      
      // Update the requests list to reflect the status change
      await fetchPatientRequests({ 
        page: requestsPagination.page, 
        limit: requestsPagination.limit 
      });
      
      return response;
    } catch (err) {
      // Handle authentication errors specifically
      if (err.message === 'No authentication token found') {
        setError('Your session has expired. Please log in again.');
        // Optionally redirect to login
        setTimeout(() => {
          if (logout) logout();
          router.push('/login/doctor');
        }, 3000);
      } else {
        setError(err.message || 'Failed to accept request');
      }
      console.error('Error accepting request:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reject patient request
  const handleRejectRequest = async (requestId) => {
    setLoading(true);
    setError(null);
    try {
      // Check if user is authenticated before proceeding
      if (!currentUser || !authToken) {
        throw new Error('You must be logged in to reject a request');
      }
      
      const response = await rejectPatientRequest(requestId);
      
      // Update the requests list to reflect the status change
      await fetchPatientRequests({ 
        page: requestsPagination.page, 
        limit: requestsPagination.limit 
      });
      
      return response;
    } catch (err) {
      // Handle authentication errors specifically
      if (err.message === 'No authentication token found') {
        setError('Your session has expired. Please log in again.');
        // Optionally redirect to login
        setTimeout(() => {
          if (logout) logout();
          router.push('/login/doctor');
        }, 3000);
      } else {
        setError(err.message || 'Failed to reject request');
      }
      console.error('Error rejecting request:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    doctor,
    loading,
    error,
    availability,
    dashboardStats,
    reviews,
    appointments,
    appointmentDetails,
    pagination,
    patientRequests,
    requestsPagination,
    completeProfile: handleCompleteProfile,
    fetchDoctorProfile,
    updateProfile: handleUpdateProfile,
    setAvailability: handleSetAvailability,
    fetchAvailability,
    changePassword: handleChangePassword,
    deleteAccount: handleDeleteAccount,
    fetchDashboardStats,
    fetchDoctorReviews,
    fetchAppointments,
    getAppointmentDetails: fetchAppointmentDetails, // Add this line
    submitResponse: handleSubmitAppointmentResponse,
    fetchPatientRequests,
    acceptRequest: handleAcceptRequest,
    rejectRequest: handleRejectRequest,
    isProfileComplete: doctor?.isProfileComplete || false
  };

  return (
    <DoctorContext.Provider value={value}>
      {children}
    </DoctorContext.Provider>
  );
};

export const useDoctor = () => {
  const context = useContext(DoctorContext);
  if (context === undefined) {
    throw new Error('useDoctor must be used within a DoctorProvider');
  }
  return context;
};
