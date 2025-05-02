import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaFilePdf,
  FaDownload,
  FaPaperPlane,
  FaFileAlt,
  FaFileImage,
  FaSpinner
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
  const { getAppointmentDetails } = useDoctor();
  
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await getAppointmentDetails(patientId);
        if (response && response.data) {
          setAppointmentDetails(response.data);
        }
      } catch (error) {
        console.error("Error fetching appointment details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetails();
  }, [patientId, getAppointmentDetails]);
  
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
  
  const isPending = appointmentDetails?.status === 'pending';
  
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
                  <span className="text-sm text-gray-800">Patient Name {patientId}</span>
                </div>

                {/* Age */}
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="sm:w-32 text-sm font-medium text-gray-500">Age:</span>
                  <span className="text-sm text-gray-800">{20 + patientId} years</span>
                </div>

                {/* Gender */}
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="sm:w-32 text-sm font-medium text-gray-500">Gender:</span>
                  <span className="text-sm text-gray-800">
                    {patientId % 2 === 0 ? "Male" : "Female"}
                  </span>
                </div>

                {/* Email */}
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="sm:w-32 text-sm font-medium text-gray-500">Email:</span>
                  <span className="text-sm text-gray-800 break-words">
                    patient{patientId}@example.com
                  </span>
                </div>

                {/* Phone */}
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="sm:w-32 text-sm font-medium text-gray-500">Phone:</span>
                  <span className="text-sm text-gray-800">
                    +1 (555) 123-{4000 + patientId}
                  </span>
                </div>

                {/* Emergency Contact */}
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="sm:w-32 text-sm font-medium text-gray-500">Emergency Contact:</span>
                  <span className="text-sm text-gray-800">
                    +1 (555) 987-{6000 + patientId}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Problem:
                </label>
                <div className="text-gray-600 placeholder-gray-400 border border-gray-300 rounded-md p-2">
                  Cancer patients face a wide array of challenges, including
                  physical problems like pain and fatigue, emotional and
                  psychological distress, and social and financial difficulties,
                  all of which can significantly impact their quality of life.
                  Here's a brief overview of some common problems faced by cancer
                  patients:
                </div>
              </div>
            </div>

            {/* Uploaded Medical Files */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Uploaded Medical Files
              </h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="space-y-3">
                  {/* PDF */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaFilePdf className="text-red-500 text-xl mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Medical_History_{patientId}.pdf
                        </p>
                        <p className="text-xs text-gray-500">
                          1.8 MB - Uploaded on April 1, 2025
                        </p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 cursor-pointer whitespace-nowrap !rounded-button">
                      <FaDownload className="inline mr-1" /> Download
                    </button>
                  </div>

                  {/* Image */}
                  {patientId % 2 === 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaFileImage className="text-blue-500 text-xl mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            X-Ray_Results_{patientId}.jpg
                          </p>
                          <p className="text-xs text-gray-500">
                            3.2 MB - Uploaded on April 3, 2025
                          </p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 cursor-pointer whitespace-nowrap !rounded-button">
                        <FaDownload className="inline mr-1" /> Download
                      </button>
                    </div>
                  )}

                  {/* Doc */}
                  {patientId % 3 === 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaFileAlt className="text-green-500 text-xl mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            Lab_Results_{patientId}.docx
                          </p>
                          <p className="text-xs text-gray-500">
                            0.9 MB - Uploaded on April 4, 2025
                          </p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 cursor-pointer whitespace-nowrap !rounded-button">
                        <FaDownload className="inline mr-1" /> Download
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleOpenResponseModal}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer flex items-center"
              >
                <FaPaperPlane className="inline mr-2 transform rotate-12" />
                Send Response
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Response Modal */}
      {showResponseModal && (
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