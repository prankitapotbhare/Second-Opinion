import React from "react";
import { useRouter } from 'next/navigation'; // Import useRouter
import {
  FaTimes,
  FaFilePdf,
  FaDownload,
  FaPaperPlane,
} from "react-icons/fa";

const PatientDetailModal = ({
  patientId,
  // responseMessage, // Removed unused prop
  onClose,
  // onSetResponseMessage, // Removed unused prop
}) => {
  const router = useRouter(); // Initialize router

  const handleNavigateToResponse = () => {
    // Close the modal immediately for better perceived responsiveness
    onClose(); 

    // Define the target route for the Response page
    const responsePageRoute = '/doctor/response'; 
    
    // Initiate navigation
    // Optionally pass patientId or other relevant data via query params if needed
    // router.push(`${responsePageRoute}?patientId=${patientId}`); 
    router.push(responsePageRoute); 
    // Navigation happens asynchronously after this call
  };

  
  return (
    <div className="fixed inset-0 flex items-center justify-center px-4 z-50 bg-[rgba(0,0,0,0.5)]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Patient Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Information Sections - Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Personal Information
              </h3>
              <div className="space-y-3">
                <div className="flex">
                  <span className="w-32 text-sm font-medium text-gray-500">Name:</span>
                  <span className="text-sm text-gray-800">Patient Name {patientId}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-sm font-medium text-gray-500">Age:</span>
                  <span className="text-sm text-gray-800">{20 + patientId} years</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-sm font-medium text-gray-500">Gender:</span>
                  <span className="text-sm text-gray-800">
                    {patientId % 2 === 0 ? "Male" : "Female"}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-32 text-sm font-medium text-gray-500">Email:</span>
                  <span className="text-sm text-gray-800">
                    patient{patientId}@example.com
                  </span>
                </div>
                <div className="flex">
                  <span className="w-32 text-sm font-medium text-gray-500">Phone:</span>
                  <span className="text-sm text-gray-800">
                    +1 (555) 123-{4000 + patientId}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-32 text-sm font-medium text-gray-500">Emergency Contact:</span>
                  <span className="text-sm text-gray-800">
                    +1 (555) 987-{6000 + patientId}
                  </span>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Medical Information
              </h3>
              <div className="space-y-3">
                <div className="flex">
                  <span className="w-32 text-sm font-medium text-gray-500">Blood Type:</span>
                  <span className="text-sm text-gray-800">B+</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-sm font-medium text-gray-500">Allergies:</span>
                  <span className="text-sm text-gray-800">Latex, Shellfish</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-sm font-medium text-gray-500">Conditions:</span>
                  <span className="text-sm text-gray-800">Arthritis</span>
                </div>
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
                        Medical_History_1.pdf
                      </p>
                      <p className="text-xs text-gray-500">
                        1.8 MB - Uploaded on April 1, 2025
                      </p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 cursor-pointer">
                    <FaDownload className="inline mr-1" /> Download
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Appointment Details
            </h3>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Date & Time</h4>
                  <p className="text-sm text-gray-800">April 5, 2025 | 10:00 AM</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Type</h4>
                  <p className="text-sm text-gray-800">Follow-up</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                    Pending
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Reason for Visit</h4>
                  <p className="text-sm text-gray-800">Persistent headaches</p>
                </div>
              </div>
            </div>
          </div>
          {/* Removed Response Section Content */}
          {/* The container div with top border and padding is removed */}
          {/* Kept only the button container */}
          <div className="flex justify-end mt-6 pt-6 border-t border-gray-200"> 
            {/* Added margin-top, padding-top and border-top here */}
            <button
              onClick={handleNavigateToResponse} // Handler remains the same
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer flex items-center"
            >
              <FaPaperPlane className="inline mr-2 transform rotate-12" />
              Send Response
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailModal;
