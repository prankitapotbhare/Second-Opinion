"use client";
import React, { useState, useEffect } from "react";
import PatientDetailModal from "./PatientDetailModal";
import {
  FaChevronDown,
  FaUser,
  FaClipboardCheck,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaSpinner,
} from "react-icons/fa";
import { useDoctor } from "@/contexts/DoctorContext";
import { format, subMonths, addMonths, isWithinInterval } from "date-fns";

const AppointmentSection = () => {
  const [showPatientDetail, setShowPatientDetail] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all"); // Changed default to "all"
  const [activeTab, setActiveTab] = useState("appointments");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("pending");
  
  // Get appointments and related functions from DoctorContext
  const { 
    appointments, 
    fetchAppointments, 
    pagination, 
    patientRequests, 
    fetchPatientRequests,
    requestsPagination,
    loading
  } = useDoctor();

  // Fetch appointments when component mounts or filter changes
  useEffect(() => {
    // Don't run the effect if we're already loading from the context
    if (loading) {
      return;
    }
    
    let isMounted = true;
    
    const fetchData = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      try {
        // Determine date filter based on activeFilter
        let dateRange = null;
        const today = new Date();
        
        switch (activeFilter) {
          case "today":
            dateRange = {
              startDate: today.toISOString().split('T')[0],
              endDate: today.toISOString().split('T')[0]
            };
            break;
          case "past3months":
            dateRange = {
              startDate: subMonths(today, 3).toISOString().split('T')[0],
              endDate: today.toISOString().split('T')[0]
            };
            break;
          case "past6months":
            dateRange = {
              startDate: subMonths(today, 6).toISOString().split('T')[0],
              endDate: today.toISOString().split('T')[0]
            };
            break;
          case "pastyear":
            dateRange = {
              startDate: subMonths(today, 12).toISOString().split('T')[0],
              endDate: today.toISOString().split('T')[0]
            };
            break;
          case "future3months":
            dateRange = {
              startDate: today.toISOString().split('T')[0],
              endDate: addMonths(today, 3).toISOString().split('T')[0]
            };
            break;
          case "all":
          default:
            dateRange = null;
            break;
        }
        
        if (activeTab === 'appointments') {
          await fetchAppointments({
            page: currentPage,
            limit: 10,
            dateRange,
            status: statusFilter
          });
        } else if (activeTab === 'requests') {
          await fetchPatientRequests({ 
            page: currentPage, 
            limit: 10 
          });
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab}:`, error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [activeTab, activeFilter, currentPage, statusFilter]);

  const handleSendResponse = async (responseData) => {
    try {
      // Here you would typically send the data to your API
      console.log("Response data:", responseData);
      
      // Refresh appointments after sending response
      await fetchAppointments({
        page: currentPage,
        limit: 10,
        status: statusFilter
      });
      
      // Close the patient detail modal
      setShowPatientDetail(null);
    } catch (error) {
      console.error("Error sending response:", error);
    }
  };

  // Handle accept request with proper API call
  const handleAcceptRequest = async (requestId) => {
    try {
      // Call the API to accept the request
      // This would typically be a function from your DoctorContext
      console.log("Accepting request:", requestId);
      
      // Refresh requests after accepting
      await fetchPatientRequests({ 
        page: currentPage, 
        limit: 10 
      });
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  // Handle reject request with proper API call
  const handleRejectRequest = async (requestId) => {
    try {
      // Call the API to reject the request
      // This would typically be a function from your DoctorContext
      console.log("Rejecting request:", requestId);
      
      // Refresh requests after rejecting
      await fetchPatientRequests({ 
        page: currentPage, 
        limit: 10 
      });
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= getTotalPages()) {
      setCurrentPage(newPage);
    }
  };

  // Get total pages based on active tab
  const getTotalPages = () => {
    if (activeTab === 'appointments') {
      return pagination?.total && pagination?.limit ? Math.ceil(pagination.total / pagination.limit) : 1;
    } else {
      return requestsPagination?.total && requestsPagination?.limit ? Math.ceil(requestsPagination.total / requestsPagination.limit) : 1;
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  // Check if we have data to display
  const hasAppointments = Array.isArray(appointments) && appointments.length > 0;
  const hasRequests = Array.isArray(patientRequests) && patientRequests.length > 0;

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6">
      {/* Main container for Appointments/Requests */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 mb-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          {/* Left side: Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Date Range Dropdown - UPDATED */}
            <div className="relative">
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="appearance-none px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="past3months">Past 3 Months</option>
                <option value="past6months">Past 6 Months</option>
                <option value="pastyear">Past Year</option>
                <option value="future3months">Next 3 Months</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FaChevronDown className="text-xs" />
              </div>
            </div>
            
            {/* Status Filter Dropdown */}
            {activeTab === 'appointments' && (
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                  <option value="all">All Status</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FaChevronDown className="text-xs" />
                </div>
              </div>
            )}
          </div>
          
          {/* Right side: Requests Tab */}
          <div className="flex items-center">
            <button 
              className={`ml-4 px-4 py-2 text-sm font-medium ${
                activeTab === 'appointments' 
                  ? 'text-gray-800 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('appointments');
                setCurrentPage(1);
              }}
            >
              Appointments
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'requests' 
                  ? 'text-gray-800 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('requests');
                setCurrentPage(1);
              }}
            >
              Requests
            </button>
          </div>
        </div>

        {/* Loading Indicator */}
        {(isLoading || loading) && (
          <div className="flex justify-center items-center py-8">
            <FaSpinner className="animate-spin text-blue-600 text-2xl" />
          </div>
        )}

        {/* Conditional Content: Appointments Table or Requests Grid */}
        {!isLoading && !loading && activeTab === 'appointments' && (
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
                  {Array.isArray(appointments) && appointments.length > 0 ? (
                    appointments.map((appointment) => (
                      <tr key={appointment._id || appointment.appointmentId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              {appointment.photoURL ? (
                                <img 
                                  src={appointment.photoURL} 
                                  alt={appointment.fullName} 
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <FaUser />
                              )}
                            </div>
                            <div className="ml-3 sm:ml-4">
                              <div className="font-medium text-gray-900">
                                {appointment.fullName || "Patient"}
                              </div>
                              <div className="text-gray-500 text-xs sm:text-sm">
                                {appointment.email || "No email provided"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">{formatDate(appointment.submittedAt || appointment.createdAt)}</div>
                          <div className="text-gray-500 text-xs sm:text-sm">
                            {appointment.appointmentTime || "Not specified"}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              appointment.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : appointment.status === "approved"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {appointment.status ? appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1) : "Pending"}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            className={`px-3 py-1 ${
                              appointment.status === 'pending' 
                                ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' 
                                : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            } rounded-md transition-colors`}
                            onClick={() => appointment.status === 'pending' && setShowPatientDetail(appointment._id || appointment.appointmentId)}
                            disabled={appointment.status !== 'pending'}
                          >
                            <FaClipboardCheck className="inline-block mr-1" />
                            Review
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 sm:px-6 py-8 text-center text-gray-500">
                        No appointments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {hasAppointments && pagination && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-6 space-y-4 sm:space-y-0">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{pagination.total > 0 ? (currentPage - 1) * (pagination.limit || 10) + 1 : 0}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * (pagination.limit || 10), pagination.total || 0)}
                  </span> of{" "}
                  <span className="font-medium">{pagination.total || 0}</span> results
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <FaChevronLeft />
                  </button>
                  
                  {/* Generate page buttons */}
                  {Array.from({ length: Math.min(3, getTotalPages()) }, (_, i) => {
                    // Calculate which page numbers to show
                    let pageNum;
                    if (getTotalPages() <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage === 1) {
                      pageNum = i + 1;
                    } else if (currentPage === getTotalPages()) {
                      pageNum = getTotalPages() - 2 + i;
                    } else {
                      pageNum = currentPage - 1 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        className={`px-2 sm:px-3 py-1 border border-gray-300 rounded-md text-sm ${
                          pageNum === currentPage
                            ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button 
                    className="px-2 sm:px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === getTotalPages()}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {!isLoading && !loading && activeTab === 'requests' && (
          // Appointment Requests Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hasRequests ? (
              patientRequests.map((request) => (
                <div key={request.requestId} className="border border-gray-300 rounded-lg p-4 shadow-sm">
                  <h3 className="text-base font-semibold text-gray-800 mb-1">{request.fullName}</h3>
                  <p className="text-sm text-gray-600 mb-3">{request.appointmentDate} at {request.appointmentTime}</p>
                  <div className="flex space-x-2">
                    <button 
                      className="flex-1 px-3 py-1.5 border border-green-500 bg-green-50 text-green-700 rounded-md hover:bg-green-100 text-sm font-medium"
                      onClick={() => handleAcceptRequest(request.requestId)}
                    >
                      Accept
                    </button>
                    <button 
                      className="flex-1 px-3 py-1.5 border border-red-500 bg-red-50 text-red-700 rounded-md hover:bg-red-100 text-sm font-medium"
                      onClick={() => handleRejectRequest(request.requestId)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No pending requests found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Patient Detail Modal */}
      {showPatientDetail && (
        <PatientDetailModal
          patientId={showPatientDetail}
          onClose={() => setShowPatientDetail(null)}
          onSendResponse={handleSendResponse}
        />
      )}
    </main>
  );
};

export default AppointmentSection;