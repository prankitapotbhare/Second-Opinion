import React from "react";

import {
  FaTimes,
  FaFilePdf,
  FaDownload,
  FaPaperPlane,
} from "react-icons/fa";

const PatientDetailModal = ({
  patientId,
  responseMessage,
  showResponseSection,
  onClose,
  onSetShowResponseSection,
  onSetResponseMessage,
  onSendResponse,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(0,0,0,0.5)]">
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

          {/* Send Response Button */}
          {!showResponseSection && (
            <div className="flex justify-center">
              <button
                onClick={() => onSetShowResponseSection(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
              >
                Send Response
              </button>
            </div>
          )}

          {/* Response Section */}
          {showResponseSection && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Your Response
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 text-gray-600 placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                    placeholder="Enter your medical opinion, advice, or prescription details..."
                    value={responseMessage}
                    onChange={(e) => onSetResponseMessage(e.target.value)}
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => onSetShowResponseSection(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onSendResponse}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                  >
                    <FaPaperPlane className="inline mr-2" />
                    Send Response
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetailModal;
