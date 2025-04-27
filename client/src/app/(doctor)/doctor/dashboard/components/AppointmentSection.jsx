"use client";
import React, { useState } from "react";
import PatientDetailModal from "./PatientDetailModal";
import {
  FaChevronDown,
  FaUser,
  FaClipboardCheck,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaCalendarAlt,
  // Removed FaFilter as it's not in the new design
} from "react-icons/fa";

// Sample data for requests
const sampleRequests = [
  { id: 1, name: "Shuvam Sharma", time: "12 Jun 2024 at 10:00 A.M" },
  { id: 2, name: "Karuna Sharma", time: "13 Jun 2024 at 11:00 A.M" },
  { id: 3, name: "Suryam Sharma", time: "13 Jun 2024 at 12:00 A.M" },
  { id: 4, name: "vanikta Sharma", time: "13 Jun 2024 at 01:00 A.M" },
  { id: 5, name: "Rajvam Sharma", time: "13 Jun  2024 at 02:00 P.M" },
  { id: 6, name: "Shuvam Khajuria", time: "13 Jun  2024 at 03:00 A.M" },
];

const AppointmentSection = () => {
  const [showPatientDetail, setShowPatientDetail] = useState(null);
  const [showResponseSuccess, setShowResponseSuccess] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [activeFilter, setActiveFilter] = useState("today");
  // State to manage the active tab: 'appointments' or 'requests'
  const [activeTab, setActiveTab] = useState("appointments"); 

  const handleSendResponse = () => {
    setShowResponseSuccess(true);
    setTimeout(() => {
      setShowResponseSuccess(false);
      setShowPatientDetail(null);
      setResponseMessage("");
    }, 2000);
  };

  // Placeholder functions for accept/reject
  const handleAcceptRequest = (requestId) => {
    console.log("Accepted request:", requestId);
    // Add logic to handle acceptance
  };

  const handleRejectRequest = (requestId) => {
    console.log("Rejected request:", requestId);
    // Add logic to handle rejection
  };


  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6">
      {/* Main container for Appointments/Requests */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 mb-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          {/* Left side: Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Date Range Dropdown */}
            <div className="relative">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 whitespace-nowrap text-sm">
                <FaCalendarAlt className="mr-2 text-gray-500" />
                <span>{activeFilter === "today" ? "Today" : activeFilter === "week" ? "This Week" : "This Month"}</span>
                <FaChevronDown className="ml-2 text-xs" />
              </button>
              {/* Dropdown content would go here */}
            </div>
            {/* Day/Week/Month Buttons */}
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button 
                className={`px-4 py-2 text-sm ${activeFilter === "today" ? "bg-blue-50 text-blue-600" : "bg-white text-gray-700"} border-r border-gray-300`}
                onClick={() => setActiveFilter("today")}
              >
                Day
              </button>
              <button 
                className={`px-4 py-2 text-sm ${activeFilter === "week" ? "bg-blue-50 text-blue-600" : "bg-white text-gray-700"} border-r border-gray-300`}
                onClick={() => setActiveFilter("week")}
              >
                Week
              </button>
              <button 
                className={`px-4 py-2 text-sm ${activeFilter === "month" ? "bg-blue-50 text-blue-600" : "bg-white text-gray-700"}`}
                onClick={() => setActiveFilter("month")}
              >
                Month
              </button>
            </div>
          </div>
          
          {/* Right side: Requests Tab */}
          <div className="flex items-center">
            {/* Optionally, add an "Appointments" tab if needed */}
            <button 
              className={`ml-4 px-4 py-2 text-sm font-medium ${
                activeTab === 'appointments' 
                  ? 'text-gray-800 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('appointments')}
            >
              Appointments
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'requests' 
                  ? 'text-gray-800 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('requests')}
            >
              Requests
            </button>
          </div>
        </div>

        {/* Conditional Content: Appointments Table or Requests Grid */}
        {activeTab === 'appointments' && (
          <>
            {/* Appointments Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Patient
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Date & Time
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <tr key={item} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <FaUser />
                          </div>
                          <div className="ml-3 sm:ml-4">
                            <div className="font-medium text-gray-900">
                              Patient Name {item}
                            </div>
                            <div className="text-gray-500 text-xs sm:text-sm">
                              patient{item}@example.com
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">April 5, 2025</div>
                        <div className="text-gray-500 text-xs sm:text-sm">
                          {9 + item}:00 AM
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item % 2 === 0
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {item % 2 === 0 ? "Completed" : "Pending"}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors"
                          onClick={() => setShowPatientDetail(item)}
                        >
                          <FaClipboardCheck className="inline-block mr-1" />
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 space-y-4 sm:space-y-0">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">5</span> of{" "}
                <span className="font-medium">24</span> results
              </div>
              <div className="flex space-x-2">
                <button className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 text-sm">
                  <FaChevronLeft />
                </button>
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    className={`px-2 sm:px-3 py-1 border border-gray-300 rounded-md text-sm ${
                      num === 1
                        ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 text-sm">
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'requests' && (
          // Appointment Requests Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleRequests.map((request) => (
              <div key={request.id} className="border border-gray-300 rounded-lg p-4 shadow-sm">
                <h3 className="text-base font-semibold text-gray-800 mb-1">{request.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{request.time}</p>
                <div className="flex space-x-2">
                  <button 
                    className="flex-1 px-3 py-1.5 border border-green-500 bg-green-50 text-green-700 rounded-md hover:bg-green-100 text-sm font-medium"
                    onClick={() => handleAcceptRequest(request.id)}
                  >
                    Accept
                  </button>
                  <button 
                    className="flex-1 px-3 py-1.5 border border-red-500 bg-red-50 text-red-700 rounded-md hover:bg-red-100 text-sm font-medium"
                    onClick={() => handleRejectRequest(request.id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Patient Detail Modal (only shown when reviewing from appointments table) */}
      {activeTab === 'appointments' && showPatientDetail && (
        <PatientDetailModal
          patientId={showPatientDetail}
          responseMessage={responseMessage}
          onClose={() => setShowPatientDetail(null)}
          onSetResponseMessage={setResponseMessage}
          onSendResponse={handleSendResponse}
        />
      )}

      {/* Success Message */}
      {showResponseSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 flex items-center shadow-xl animate-fade-in-up">
            <FaCheckCircle className="text-green-500 text-2xl mr-3" />
            <span className="text-gray-800 font-medium">
              Response sent successfully!
            </span>
          </div>
        </div>
      )}
    </main>
  );
};

export default AppointmentSection;
