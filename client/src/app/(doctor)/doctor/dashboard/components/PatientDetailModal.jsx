import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaFilePdf,
  FaDownload,
  FaPaperPlane,
  FaFileAlt,
  FaFileImage,
  FaSpinner,
  FaExternalLinkAlt
} from "react-icons/fa";
import ResponseModal from "./ResponseModal";
import { useDoctor } from "@/contexts/DoctorContext";

const PatientDetailModal = ({
  patientId,
  onClose,
  onSendResponse,
}) => {
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const { getAppointmentDetails } = useDoctor();
  
  useEffect(() => {
    // Only fetch if we have a patientId and haven't already attempted to fetch
    if (patientId && !hasAttemptedFetch) {
      const fetchDetails = async () => {
        try {
          setLoading(true);
          const response = await getAppointmentDetails(patientId);
          if (response && response.data) {
            setAppointmentDetails(response.data);
          }
        } catch (error) {
          console.error("Error fetching appointment details:", error);
          setError(error.message || "Failed to load appointment details");
        } finally {
          setLoading(false);
          setHasAttemptedFetch(true);
        }
      };
      
      fetchDetails();
    }
  }, [patientId, getAppointmentDetails, hasAttemptedFetch]);
  
  const handleOpenResponseModal = () => {
    setShowResponseModal(true);
  };

  const handleCloseResponseModal = () => {
    setShowResponseModal(false);
  };

  const handleSendResponse = (responseData) => {
    // Pass the response data to the parent component
    if (onSendResponse) {
      onSendResponse(responseData);
    }
  };
  
  const handleDownloadFile = (fileUrl, fileName) => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'download'; // Ensure there's always a filename
    link.target = '_blank'; // Open in new tab
    link.rel = 'noopener noreferrer'; // Security best practice
    
    // For files hosted on the same domain, we can use this approach
    // For cross-origin files, this might not work due to CORS restrictions
    fetch(fileUrl)
      .then(response => response.blob())
      .then(blob => {
        // Create a blob URL for the file
        const blobUrl = URL.createObjectURL(blob);
        link.href = blobUrl;
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        }, 100);
      })
      .catch(error => {
        console.error("Error downloading file:", error);
        // Fallback to direct download if fetch fails
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  };
  
  const handleOpenFileInNewTab = (fileUrl) => {
    window.open(fileUrl, '_blank');
  };
  
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Patient Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 cursor-pointer whitespace-nowrap"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <FaSpinner className="animate-spin text-blue-600 text-2xl" />
          </div>
        ) : (
          <div className="p-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 gap-6 mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="sm:w-32 text-sm font-medium text-gray-500">Name:</span>
                  <span className="text-sm text-gray-800">
                    {appointmentDetails?.fullName || "Not provided"}
                  </span>
                </div>

                {/* Age */}
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="sm:w-32 text-sm font-medium text-gray-500">Age:</span>
                  <span className="text-sm text-gray-800">
                    {appointmentDetails?.age ? `${appointmentDetails.age} years` : "Not provided"}
                  </span>
                </div>

                {/* Gender */}
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="sm:w-32 text-sm font-medium text-gray-500">Gender:</span>
                  <span className="text-sm text-gray-800">
                    {appointmentDetails?.gender || "Not provided"}
                  </span>
                </div>

                {/* Email */}
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="sm:w-32 text-sm font-medium text-gray-500">Email:</span>
                  <span className="text-sm text-gray-800 break-words">
                    {appointmentDetails?.email || "Not provided"}
                  </span>
                </div>

                {/* Phone */}
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="sm:w-32 text-sm font-medium text-gray-500">Phone:</span>
                  <span className="text-sm text-gray-800">
                    {appointmentDetails?.contactNumber || "Not provided"}
                  </span>
                </div>

                {/* Emergency Contact */}
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="sm:w-32 text-sm font-medium text-gray-500">Emergency Contact:</span>
                  <span className="text-sm text-gray-800">
                    {appointmentDetails?.emergencyContact || "Not provided"}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Problem:
                </label>
                <div className="text-gray-600 placeholder-gray-400 border border-gray-300 rounded-md p-2">
                  {appointmentDetails?.problem || "No problem description provided"}
                </div>
              </div>
            </div>

            {/* Uploaded Medical Files */}
            {appointmentDetails?.medicalFiles && appointmentDetails.medicalFiles.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Uploaded Medical Files
                </h3>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="space-y-3">
                    {appointmentDetails.medicalFiles.map((file, index) => {
                      // Determine file icon based on file type
                      let FileIcon = FaFileAlt;
                      if (file.fileType?.includes('pdf')) {
                        FileIcon = FaFilePdf;
                      } else if (file.fileType?.includes('image')) {
                        FileIcon = FaFileImage;
                      }
                      
                      // Determine if file can be viewed in browser
                      const canViewInBrowser = file.fileType?.includes('pdf') || 
                                              file.fileType?.includes('image') ||
                                              file.fileType?.includes('text');
                      
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FileIcon className={`${
                              file.fileType?.includes('pdf') ? 'text-red-500' : 
                              file.fileType?.includes('image') ? 'text-blue-500' : 
                              'text-green-500'
                            } text-xl mr-3`} />
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {file.fileName || `File ${index + 1}`}
                              </p>
                              <p className="text-xs text-gray-500">
                                {file.fileSize ? `${(file.fileSize / (1024 * 1024)).toFixed(1)} MB` : ''} 
                                {file.uploadDate ? ` - Uploaded on ${new Date(file.uploadDate).toLocaleDateString()}` : ''}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {canViewInBrowser && (
                              <button 
                                className="text-indigo-600 hover:text-indigo-800 cursor-pointer whitespace-nowrap !rounded-button"
                                onClick={() => handleOpenFileInNewTab(file.filePath)}
                                title="Open in new tab"
                              >
                                <FaExternalLinkAlt className="inline mr-1" /> View
                              </button>
                            )}
                            <button 
                              className="text-blue-600 hover:text-blue-800 cursor-pointer whitespace-nowrap !rounded-button"
                              onClick={() => handleDownloadFile(file.filePath, file.fileName)}
                              title="Download file"
                            >
                              <FaDownload className="inline mr-1" /> Download
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleOpenResponseModal}
                className={`px-6 py-2 ${
                  appointmentDetails?.status === "pending" 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } rounded-md flex items-center`}
                disabled={appointmentDetails?.status !== "pending"}
              >
                <FaPaperPlane className="inline mr-2 transform rotate-12" />
                {appointmentDetails?.status === "pending" ? "Send Response" : "Already Responded"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Response Modal - Only show if status is pending */}
      {showResponseModal && appointmentDetails?.status === "pending" && (
        <ResponseModal
          isOpen={showResponseModal}
          onClose={handleCloseResponseModal}
          patientId={patientId}
          onSendResponse={handleSendResponse}
        />
      )}
    </div>
  );
};

export default PatientDetailModal;