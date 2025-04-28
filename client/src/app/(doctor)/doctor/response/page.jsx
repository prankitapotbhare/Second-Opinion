"use client"; // Add this if you use client-side hooks like useState

import React, { useState } from 'react';
import { FaUpload, FaArrowRight, FaFile, FaTrash, FaCheckCircle } from 'react-icons/fa'; // Added FaCheckCircle
import { useRouter } from 'next/navigation'; // Added router import

const ResponsePage = () => {
  const [secondOpinionRequired, setSecondOpinionRequired] = useState(null); // null, 'yes', 'no'
  const [message, setMessage] = useState(
    "As a precaution, please avoid heavy activities and ensure proper rest. Let's do a detailed evaluation soon. In the meantime, maintain a healthy diet and stay hydrated. If symptoms worsen suddenly, don't hesitate to seek immediate medical attention. Keep a daily log of your symptoms to help us understand any patterns. Avoid screen time and loud environments if they trigger discomfort."
  );
  const [selectedFile, setSelectedFile] = useState(null); // Add state for selected file
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // Added state for success popup
  const router = useRouter(); // Initialize router

  const handleSendResponse = () => {
    console.log("Sending response:", { secondOpinionRequired, message, selectedFile });
    // Add logic to actually send the response data
    
    // Show success popup
    setShowSuccessPopup(true);
    
    // Redirect after 3 seconds
    setTimeout(() => {
      setShowSuccessPopup(false);
      // Redirect back to appointments section
      router.push('/doctor/appointments');
    }, 3000);
  };

  const handleFileUploadClick = () => {
    // Trigger hidden file input click
    document.getElementById('fileUploadInput').click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("File selected:", file.name);
      setSelectedFile(file); // Store the selected file in state
    }
  };

  // Add function to delete the selected file
  const handleDeleteFile = () => {
    setSelectedFile(null);
    // Reset the file input to allow selecting the same file again
    const fileInput = document.getElementById('fileUploadInput');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6 sm:p-8 border border-gray-200">
        
        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center border-b pb-2">
          Response
        </h2>

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
        <div className="mb-8">
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

        {/* Send Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSendResponse}
            className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Send Response
            <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/70 z-50">
          <div className="bg-white rounded-lg shadow-xl/30 p-6 max-w-sm w-full mx-4 animate-fade-in">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FaCheckCircle className="text-green-500 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Success!</h3>
              <p className="text-gray-600 mb-4">Your response has been sent successfully.</p>
              <p className="text-sm text-gray-500">Redirecting to appointments...</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ResponsePage;