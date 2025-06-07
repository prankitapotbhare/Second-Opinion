"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAdminStats, 
  getAllDoctors, 
  getAllPatients,
  getDoctorPatientsExcel,
  getDoctorInvoicePdf,
  sendDoctorInvoiceEmail
} from '@/api/admin.api';
import { showSuccessToast, showErrorToast } from '@/utils/toast';

// Create the admin context
const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctorsPagination, setDoctorsPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [patientsPagination, setPatientsPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  // Add per-action loading states
  const [loadingViewDocument, setLoadingViewDocument] = useState(null); // doctorId or null
  const [loadingViewInvoice, setLoadingViewInvoice] = useState(null); // doctorId or null
  const [loadingSendInvoice, setLoadingSendInvoice] = useState(null); // doctorId or null
  
  // Fetch admin statistics
  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await getAdminStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      showErrorToast(error.message || "Failed to fetch admin statistics");
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch all doctors with pagination
  const fetchDoctors = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await getAllDoctors(page, limit);
      if (response.success) {
        setDoctors(response.data);
        setDoctorsPagination(response.pagination);
      }
    } catch (error) {
      showErrorToast(error.message || "Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch all patients with pagination
  const fetchPatients = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await getAllPatients(page, limit);
      if (response.success) {
        setPatients(response.data);
        setPatientsPagination(response.pagination);
      }
    } catch (error) {
      showErrorToast(error.message || "Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };
  
  // Download doctor patients Excel
  const downloadDoctorPatientsExcel = async (doctorId, doctorName) => {
    try {
      setLoadingViewDocument(doctorId);
      const blob = await getDoctorPatientsExcel(doctorId);
      
      // Create a download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${doctorName || 'doctor'}_patients.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showSuccessToast("Patients Excel file downloaded successfully");
    } catch (error) {
      showErrorToast(error.message || "Failed to download patients Excel");
    } finally {
      setLoadingViewDocument(null);
    }
  };
  
  // Download doctor invoice PDF
  const downloadDoctorInvoicePdf = async (doctorId, doctorName) => {
    try {
      setLoadingViewInvoice(doctorId);
      const blob = await getDoctorInvoicePdf(doctorId);
      
      // Create a download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${doctorName || 'doctor'}_invoice.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showSuccessToast("Invoice PDF downloaded successfully");
    } catch (error) {
      showErrorToast(error.message || "Failed to download invoice PDF");
    } finally {
      setLoadingViewInvoice(null);
    }
  };
  
  // Send doctor invoice email
  const sendInvoiceEmail = async (doctorId) => {
    try {
      setLoadingSendInvoice(doctorId);
      const response = await sendDoctorInvoiceEmail(doctorId);
      if (response.success) {
        showSuccessToast("Invoice sent successfully to doctor's email");
      }
    } catch (error) {
      showErrorToast(error.message || "Failed to send invoice email");
    } finally {
      setLoadingSendInvoice(null);
    }
  };
 
  const value = {
    stats,
    doctors,
    patients,
    doctorsPagination,
    patientsPagination,
    loading,
    loadingViewDocument,
    loadingViewInvoice,
    loadingSendInvoice,
    fetchStats,
    fetchDoctors,
    fetchPatients,
    downloadDoctorPatientsExcel,
    downloadDoctorInvoicePdf,
    sendInvoiceEmail
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};