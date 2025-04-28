import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getDoctorProfile, 
  completeProfile, 
  updateProfile, 
  setAvailability, 
  getAvailability,
  deleteAccount,
  downloadDocument
} from '@/api/doctor.api';
import { useAuth } from './AuthContext';

const DoctorContext = createContext();

export const useDoctorContext = () => useContext(DoctorContext);

export const DoctorProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availability, setAvailabilityState] = useState(null);

  // Fetch doctor profile when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.role === 'doctor') {
      fetchDoctorProfile();
    }
  }, [isAuthenticated, user]);

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

  // Complete doctor profile
  const handleCompleteProfile = async (profileData, files) => {
    setLoading(true);
    setError(null);
    try {
      const response = await completeProfile(profileData, files);
      setDoctor(response.data);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to complete profile');
      console.error('Error completing profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update doctor profile
  const handleUpdateProfile = async (profileData, files) => {
    setLoading(true);
    setError(null);
    try {
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
      const response = await setAvailability(availabilityData);
      setAvailabilityState(response.data);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to set availability');
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

  // Download doctor document
  const handleDownloadDocument = async (documentType) => {
    setLoading(true);
    setError(null);
    try {
      const blob = await downloadDocument(documentType);
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element and trigger download
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      // Set the file name based on document type
      const fileName = documentType === 'registrationCertificate' 
        ? 'registration_certificate' 
        : 'government_id';
      
      // Get file extension from content type
      const contentType = blob.type;
      const extension = contentType.includes('pdf') 
        ? '.pdf' 
        : contentType.includes('jpeg') || contentType.includes('jpg') 
          ? '.jpg' 
          : contentType.includes('png') 
            ? '.png' 
            : '';
      
      a.download = `${fileName}${extension}`;
      
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return true;
    } catch (err) {
      setError(err.message || `Failed to download ${documentType}`);
      console.error(`Error downloading ${documentType}:`, err);
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
    fetchDoctorProfile,
    completeProfile: handleCompleteProfile,
    updateProfile: handleUpdateProfile,
    setAvailability: handleSetAvailability,
    fetchAvailability,
    deleteAccount: handleDeleteAccount,
    downloadDocument: handleDownloadDocument,
    isProfileComplete: doctor?.isProfileComplete || false
  };

  return (
    <DoctorContext.Provider value={value}>
      {children}
    </DoctorContext.Provider>
  );
};