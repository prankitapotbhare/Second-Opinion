"use client";

import React, { useState, useEffect } from 'react';
import { 
  FaUserMd, 
  FaChartLine, 
  FaUser, 
  FaCalendarCheck, 
  FaCheck, 
  FaClock, 
  FaHourglassHalf
} from 'react-icons/fa';

// Import components
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import DoctorTable from '../components/DoctorTable';
import PatientTable from '../components/PatientTable';
import Pagination from '../components/Pagination';
import { useAdmin } from '@/contexts/AdminContext';

const AdminDashboard = () => {
    // Use the admin context
    const { 
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
    } = useAdmin();
    
    // Fetch data on component mount
    useEffect(() => {
      fetchStats();
      fetchDoctors(1, 10);
      fetchPatients(1, 10);
    }, []);
    
    // Pagination handlers for doctors
    const handlePrevDoctorPage = () => {
      if (doctorsPagination.page > 1) {
        fetchDoctors(doctorsPagination.page - 1, doctorsPagination.limit);
      }
    };
    
    const handleNextDoctorPage = () => {
      if (doctorsPagination.page < doctorsPagination.totalPages) {
        fetchDoctors(doctorsPagination.page + 1, doctorsPagination.limit);
      }
    };
    
    // Pagination handlers for patients
    const handlePrevPatientPage = () => {
      if (patientsPagination.page > 1) {
        fetchPatients(patientsPagination.page - 1, patientsPagination.limit);
      }
    };
    
    const handleNextPatientPage = () => {
      if (patientsPagination.page < patientsPagination.totalPages) {
        fetchPatients(patientsPagination.page + 1, patientsPagination.limit);
      }
    };

    // Function to handle viewing documents (Excel download)
    const handleViewDocument = (doctorId) => {
      const doctor = doctors.find(doc => doc.id === doctorId);
      if (doctor) {
        downloadDoctorPatientsExcel(doctorId, doctor.name);
      }
    };

    // Function to handle invoice download
    const handleViewInvoice = (doctorId) => {
      const doctor = doctors.find(doc => doc.id === doctorId);
      if (doctor) {
        downloadDoctorInvoicePdf(doctorId, doctor.name);
      }
    };

    // Function to handle sending invoice
    const handleSendInvoice = (doctorId) => {
      sendInvoiceEmail(doctorId);
    };
    
    // Function to handle viewing patient profile
    const handleViewPatientProfile = (patientId) => {
      console.log(`Viewing profile for patient ID: ${patientId}`);
      // This could be expanded to navigate to a patient detail page
    };

    // Stats cards data - using real data from the API
    const statsCards = stats ? [
        {
            icon: <FaUserMd className="text-3xl" />,
            title: "Total Doctors",
            value: stats.totalDoctors || 0,
            chartIcon: <FaChartLine className="text-blue-600" />,
            iconColor: "text-blue-600",
            chartBgColor: "bg-blue-100"
        },
        {
            icon: <FaUser className="text-3xl" />,
            title: "Total Patients",
            value: stats.totalPatients || 0,
            chartIcon: <FaChartLine className="text-green-600" />,
            iconColor: "text-green-600",
            chartBgColor: "bg-green-100"
        },
        {
            icon: <FaCalendarCheck className="text-3xl" />,
            title: "Completed Appointments",
            value: stats.completedAppointments || 0,
            chartIcon: <FaCheck className="text-purple-600" />,
            iconColor: "text-purple-600",
            chartBgColor: "bg-purple-100"
        },
        {
            icon: <FaClock className="text-3xl" />,
            title: "Pending Appointments",
            value: stats.pendingAppointments || 0,
            chartIcon: <FaHourglassHalf className="text-amber-600" />,
            iconColor: "text-amber-600",
            chartBgColor: "bg-amber-100"
        }
    ] : [];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <Header title="Admin Dashboard" />
                
                {/* Stats Cards */}
                {stats && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                      {statsCards.map((card, index) => (
                          <StatsCard 
                              key={index}
                              icon={card.icon}
                              title={card.title}
                              value={card.value}
                              chartIcon={card.chartIcon}
                              iconColor={card.iconColor}
                              chartBgColor={card.chartBgColor}
                          />
                      ))}
                  </div>
                )}
                
                {/* Doctor Dashboard */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Doctor Dashboard</h2>
                    {doctors.length > 0 ? (
                      <>
                        <DoctorTable 
                            doctors={doctors}
                            onViewDocument={handleViewDocument}
                            onViewInvoice={handleViewInvoice}
                            onSendInvoice={handleSendInvoice}
                            loadingViewDocument={loadingViewDocument}
                            loadingViewInvoice={loadingViewInvoice}
                            loadingSendInvoice={loadingSendInvoice}
                        />
                        <Pagination 
                            currentPage={doctorsPagination.page}
                            totalPages={doctorsPagination.totalPages}
                            totalItems={doctorsPagination.total}
                            itemsPerPage={doctorsPagination.limit}
                            onPrevPage={handlePrevDoctorPage}
                            onNextPage={handleNextDoctorPage}
                            colorScheme="blue"
                        />
                      </>
                    ) : (
                      <div className="bg-white rounded-xl shadow-md p-6 text-center">
                        <p className="text-gray-500">No doctors found</p>
                      </div>
                    )}
                </div>

                {/* User Dashboard */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">User Dashboard</h2>
                    {patients.length > 0 ? (
                      <>
                        <PatientTable 
                            patients={patients}
                            onViewProfile={handleViewPatientProfile}
                        />
                        <Pagination 
                            currentPage={patientsPagination.page}
                            totalPages={patientsPagination.totalPages}
                            totalItems={patientsPagination.total}
                            itemsPerPage={patientsPagination.limit}
                            onPrevPage={handlePrevPatientPage}
                            onNextPage={handleNextPatientPage}
                            colorScheme="green"
                        />
                      </>
                    ) : (
                      <div className="bg-white rounded-xl shadow-md p-6 text-center">
                        <p className="text-gray-500">No patients found</p>
                      </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;