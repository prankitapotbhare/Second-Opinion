import React, { useState } from 'react';
import { FaUpload, FaArrowRight, FaFile, FaTrash, FaTimes } from 'react-icons/fa';
import { showSuccessToast } from '@/utils/toast';

const ResponseModal = ({ isOpen, onClose, patientId, onSendResponse, appointmentStatus }) => {
  const [secondOpinionRequired, setSecondOpinionRequired] = useState(null); // null, 'yes', 'no'
  const [message, setMessage] = useState(
    "As a precaution, please avoid heavy activities and ensure proper rest. Let's do a detailed evaluation soon. In the meantime, maintain a healthy diet and stay hydrated. If symptoms worsen suddenly, don't hesitate to seek immediate medical attention. Keep a daily log of your symptoms to help us understand any patterns. Avoid screen time and loud environments if they trigger discomfort."
  );
  const [selectedFile, setSelectedFile] = useState(null);
  
  // No need to fetch appointment status here, we'll use the prop passed from PatientDetailModal

  const handleFileUploadClick = () => {
    document.getElementById('fileUploadInput').click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDeleteFile = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById('fileUploadInput');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSendResponse = () => {
    // Don't allow sending if not pending
    if (appointmentStatus !== 'pending') {
      onClose();
      return;
    }
    
    // Validate required fields
    if (!secondOpinionRequired) {
      // You could show an error message here
      return;
    }
    
    // Prepare response data
    const responseData = {
      patientId,
      secondOpinionRequired,
      message,
      file: selectedFile
    };
    
    // Show success toast
    showSuccessToast("Response sent successfully!");
    
    // Call the parent handler
    onSendResponse(responseData);
    onClose();
  };

  if (!isOpen || appointmentStatus !== 'pending') return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Send Response</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            <FaTimes />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6">
          {/* Required Second Opinion */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Required Second opinion
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => setSecondOpinionRequired('yes')}
                className={`flex-1 py-2 px-4 rounded-md border text-center transition-colors ${
                  secondOpinionRequired === 'yes'
                  ? 'bg-green-500 text-white border-green-600'
                  : 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100'
                }`}
                >
                Yes
              </button>
              <button
                onClick={() => setSecondOpinionRequired('no')}
                className={`flex-1 py-2 px-4 rounded-md border text-center transition-colors ${
                  secondOpinionRequired === 'no'
                  ? 'bg-red-500 text-white border-red-600'
                  : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Message */}
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              rows="6"
              className="w-full px-4 py-2 border border-gray-400 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-sm"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          {/* Upload Document */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Document <span className="text-gray-500">(optional)</span>
            </label>
            <input 
              type="file" 
              id="fileUploadInput" 
              className="hidden" 
              onChange={handleFileChange} 
            />
            <div className="flex flex-col space-y-2">
              <button
                onClick={handleFileUploadClick}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FaUpload className="mr-2" />
                Upload Document
              </button>
              
              {/* Display selected file name with delete option */}
              {selectedFile && (
                <div className="flex items-center justify-between text-sm text-gray-600 mt-2 p-2 bg-gray-50 rounded-md border border-gray-200">
                  <div className="flex items-center">
                    <FaFile className="mr-2 text-blue-500" />
                    <span>{selectedFile.name}</span>
                  </div>
                  <button 
                    onClick={handleDeleteFile}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-gray-200 transition-colors"
                    title="Delete file"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSendResponse}
            className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={!secondOpinionRequired}
          >
            Send Response
            <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResponseModal;