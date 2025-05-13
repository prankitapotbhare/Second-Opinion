
"use client";

import React, { useState } from 'react';
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

const AdminDashboard = () => {
    // Add state for pagination
    const [doctorPage, setDoctorPage] = useState(1);
    const [patientPage, setPatientPage] = useState(1);
    
    // Mock data - in a real app, this would come from an API
    const totalDoctors = 124;
    const totalPatients = 248;
    const doctorsPerPage = 10;
    const patientsPerPage = 10;
    
    // Calculate total pages
    const totalDoctorPages = Math.ceil(totalDoctors / doctorsPerPage);
    const totalPatientPages = Math.ceil(totalPatients / patientsPerPage);
    
    // Mock data for doctors
    const mockDoctors = [
        {
            id: 'dr-sarah',
            name: 'Dr. Sarah Johnson',
            specialty: 'Cardiology',
            totalAppointments: 45,
            acceptedAppointments: 34,
            hasDocuments: true
        },
        {
            id: 'dr-james',
            name: 'Dr. James Williams',
            specialty: 'Dermatology',
            totalAppointments: 38,
            acceptedAppointments: 30,
            hasDocuments: false
        },
        {
            id: 'dr-emily',
            name: 'Dr. Emily Chen',
            specialty: 'Neurology',
            totalAppointments: 42,
            acceptedAppointments: 34,
            hasDocuments: true
        },
        {
            id: 'dr-michael',
            name: 'Dr. Michael Rodriguez',
            specialty: 'Orthopedics',
            totalAppointments: 50,
            acceptedAppointments: 40,
            hasDocuments: false
        },
        {
            id: 'dr-jessica',
            name: 'Dr. Jessica Thompson',
            specialty: 'Pediatrics',
            totalAppointments: 55,
            acceptedAppointments: 34,
            hasDocuments: true
        }
    ];
    
    // Mock data for patients
    const mockPatients = [
        {
            id: 'patient-1',
            name: 'John Smith',
            gender: 'Male',
            contactNumber: '+1 (555) 123-4567',
            city: 'New York'
        },
        {
            id: 'patient-2',
            name: 'Emma Johnson',
            gender: 'Female',
            contactNumber: '+1 (555) 987-6543',
            city: 'Los Angeles'
        },
        {
            id: 'patient-3',
            name: 'Michael Brown',
            gender: 'Male',
            contactNumber: '+1 (555) 456-7890',
            city: 'Chicago'
        },
        {
            id: 'patient-4',
            name: 'Sophia Garcia',
            gender: 'Female',
            contactNumber: '+1 (555) 234-5678',
            city: 'Houston'
        },
        {
            id: 'patient-5',
            name: 'William Davis',
            gender: 'Male',
            contactNumber: '+1 (555) 876-5432',
            city: 'Phoenix'
        }
    ];
    
    // Function to handle viewing documents
    const handleViewDocument = (doctorId) => {
        console.log(`Viewing documents for doctor ID: ${doctorId}`);
    };

    // Function to handle invoice download
    const handleViewInvoice = (doctorId) => {
        console.log(`Downloading invoice for doctor ID: ${doctorId}`);
    };

    // Function to handle sending invoice
    const handleSendInvoice = (doctorId) => {
        console.log(`Sending invoice for doctor ID: ${doctorId}`);
    };
    
    // Function to handle viewing patient profile
    const handleViewPatientProfile = (patientId) => {
        console.log(`Viewing profile for patient ID: ${patientId}`);
    };
    
    // Pagination handlers
    const handlePrevDoctorPage = () => {
        setDoctorPage(prev => Math.max(prev - 1, 1));
    };
    
    const handleNextDoctorPage = () => {
        setDoctorPage(prev => Math.min(prev + 1, totalDoctorPages));
    };
    
    const handlePrevPatientPage = () => {
        setPatientPage(prev => Math.max(prev - 1, 1));
    };
    
    const handleNextPatientPage = () => {
        setPatientPage(prev => Math.min(prev + 1, totalPatientPages));
    };

    // Stats cards data
    const statsCards = [
        {
            icon: <FaUserMd className="text-3xl" />,
            title: "Total Doctors",
            value: totalDoctors,
            chartIcon: <FaChartLine className="text-blue-600" />,
            iconColor: "text-blue-600",
            chartBgColor: "bg-blue-100"
        },
        {
            icon: <FaUser className="text-3xl" />,
            title: "Total Patients",
            value: totalPatients,
            chartIcon: <FaChartLine className="text-green-600" />,
            iconColor: "text-green-600",
            chartBgColor: "bg-green-100"
        },
        {
            icon: <FaCalendarCheck className="text-3xl" />,
            title: "Completed Appointments",
            value: 85,
            chartIcon: <FaCheck className="text-purple-600" />,
            iconColor: "text-purple-600",
            chartBgColor: "bg-purple-100"
        },
        {
            icon: <FaClock className="text-3xl" />,
            title: "Pending Appointments",
            value: 42,
            chartIcon: <FaHourglassHalf className="text-amber-600" />,
            iconColor: "text-amber-600",
            chartBgColor: "bg-amber-100"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <Header title="Admin Dashboard" />
                
                {/* Stats Cards */}
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
                
                {/* Doctor Dashboard */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Doctor Dashboard</h2>
                    <DoctorTable 
                        doctors={mockDoctors}
                        onViewDocument={handleViewDocument}
                        onViewInvoice={handleViewInvoice}
                        onSendInvoice={handleSendInvoice}
                    />
                    <Pagination 
                        currentPage={doctorPage}
                        totalPages={totalDoctorPages}
                        totalItems={totalDoctors}
                        itemsPerPage={doctorsPerPage}
                        onPrevPage={handlePrevDoctorPage}
                        onNextPage={handleNextDoctorPage}
                        colorScheme="blue"
                    />
                </div>

                {/* User Dashboard */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">User Dashboard</h2>
                    <PatientTable 
                        patients={mockPatients}
                        onViewProfile={handleViewPatientProfile}
                    />
                    <Pagination 
                        currentPage={patientPage}
                        totalPages={totalPatientPages}
                        totalItems={totalPatients}
                        itemsPerPage={patientsPerPage}
                        onPrevPage={handlePrevPatientPage}
                        onNextPage={handleNextPatientPage}
                        colorScheme="green"
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;