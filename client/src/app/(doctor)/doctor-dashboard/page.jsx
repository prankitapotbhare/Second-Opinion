"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUserMd, FaCalendarAlt, FaChartLine, FaClipboardList, FaCog, FaSignOutAlt, FaCheckCircle } from "react-icons/fa";

const DoctorDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  // Check if this is a redirect from form submission
  useEffect(() => {
    // Simulate loading doctor data
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Check if we came from the registration form
      const fromRegistration = sessionStorage.getItem('fromRegistration');
      if (fromRegistration) {
        setShowWelcome(true);
        // Clear the flag
        sessionStorage.removeItem('fromRegistration');
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Set the flag when component mounts
  useEffect(() => {
    // This will help us know if we came from registration when
    // we return to this page after a redirect
    sessionStorage.setItem('fromRegistration', 'true');
  }, []);

  // Mock data for the dashboard
  const stats = [
    { title: "Total Consultations", value: "0", icon: <FaCalendarAlt className="text-indigo-500" /> },
    { title: "Pending Reviews", value: "0", icon: <FaClipboardList className="text-yellow-500" /> },
    { title: "Completed", value: "0", icon: <FaCheckCircle className="text-green-500" /> },
    { title: "Earnings", value: "$0", icon: <FaChartLine className="text-blue-500" /> },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome message for new registrations */}
      {showWelcome && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaCheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Welcome to your dashboard! Your profile has been created successfully and is pending review.
              </p>
            </div>
            <button 
              onClick={() => setShowWelcome(false)}
              className="ml-auto text-green-500 hover:text-green-700 cursor-pointer"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center">
              <FaUserMd className="text-indigo-600 text-2xl mr-2" />
              <h1 className="text-xl font-bold text-gray-800">Doctor Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700 cursor-pointer">
              <FaCog className="text-xl" />
            </button>
            <button 
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => router.push('/')}
            >
              <FaSignOutAlt className="text-xl" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Welcome, Doctor</h2>
          <p className="text-gray-600">Your profile is currently under review. You'll be notified once it's approved.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 font-medium">{stat.title}</h3>
                <div className="p-2 rounded-full bg-gray-100">{stat.icon}</div>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 text-sm font-medium cursor-pointer ${
                activeTab === "overview"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-3 text-sm font-medium cursor-pointer ${
                activeTab === "profile"
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Profile
            </button>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <FaCalendarAlt className="text-indigo-600 text-xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No Consultations Yet</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Your profile is under review. Once approved, you'll start receiving consultation requests here.
                </p>
              </div>
            )}

            {activeTab === "profile" && (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Your Profile</h3>
                <p className="text-gray-600">Your profile information is currently under review by our team.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;