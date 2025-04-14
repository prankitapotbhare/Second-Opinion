"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Create the profile context
const ProfileContext = createContext();

// Mock profile data
const mockProfiles = {
  user: {
    personalInfo: {
      dateOfBirth: '1985-05-15',
      gender: 'Female',
      phone: '+91 9876543210',
      address: '123 Main St, Mumbai, India'
    },
    medicalInfo: {
      allergies: ['Penicillin', 'Peanuts'],
      conditions: ['Asthma'],
      medications: ['Albuterol']
    },
    preferences: {
      notifications: true,
      language: 'English',
      theme: 'light'
    }
  },
  doctor: {
    professionalInfo: {
      licenseNumber: 'MED12345',
      yearsOfExperience: 12,
      education: [
        { degree: 'MBBS', institution: 'AIIMS Delhi', year: '2008' },
        { degree: 'MD', institution: 'AIIMS Delhi', year: '2012' }
      ],
      specializations: ['Cardiology', 'Interventional Cardiology']
    },
    practiceInfo: {
      hospital: 'City Heart Institute',
      address: '456 Hospital Road, Delhi, India',
      consultationFee: 1500,
      availability: {
        monday: ['9:00 AM - 1:00 PM', '5:00 PM - 8:00 PM'],
        tuesday: ['9:00 AM - 1:00 PM'],
        wednesday: ['9:00 AM - 1:00 PM', '5:00 PM - 8:00 PM'],
        thursday: ['9:00 AM - 1:00 PM'],
        friday: ['9:00 AM - 1:00 PM', '5:00 PM - 8:00 PM'],
        saturday: ['9:00 AM - 1:00 PM'],
        sunday: []
      }
    },
    preferences: {
      notifications: true,
      language: 'English',
      theme: 'light'
    }
  },
  admin: {
    adminInfo: {
      department: 'System Administration',
      role: 'Super Admin',
      permissions: ['user_management', 'doctor_management', 'content_management', 'system_settings']
    },
    preferences: {
      notifications: true,
      language: 'English',
      theme: 'dark'
    }
  }
};

export const ProfileProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (currentUser) {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Get the mock profile based on user role
          const mockProfile = mockProfiles[currentUser.role];
          
          if (mockProfile) {
            setProfile(mockProfile);
          } else {
            setError('Profile not found');
          }
        } else {
          setProfile(null);
        }
      } catch (err) {
        setError('Failed to fetch profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [currentUser]);

  // Update profile function
  const updateProfile = async (updatedData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the profile
      setProfile(prevProfile => ({
        ...prevProfile,
        ...updatedData
      }));
      
      return { success: true };
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
      return { success: false, error: 'Failed to update profile' };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    profile,
    loading,
    error,
    updateProfile
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};