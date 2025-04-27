"use client"; // Add this if you use client-side hooks like useState

import React, { useState } from 'react';
import { FaUpload, FaArrowRight } from 'react-icons/fa'; // Import necessary icons

const ResponsePage = () => {
  const [secondOpinionRequired, setSecondOpinionRequired] = useState(null); // null, 'yes', 'no'
  const [message, setMessage] = useState(
    "As a precaution, please avoid heavy activities and ensure proper rest. Let's do a detailed evaluation soon. In the meantime, maintain a healthy diet and stay hydrated. If symptoms worsen suddenly, don't hesitate to seek immediate medical attention. Keep a daily log of your symptoms to help us understand any patterns. Avoid screen time and loud environments if they trigger discomfort."
  );

  const handleSendResponse = () => {
    console.log("Sending response:", { secondOpinionRequired, message /*, uploadedFile */ });
    // Add logic to actually send the response data
  };

  const handleFileUploadClick = () => {
    // Trigger hidden file input click
    document.getElementById('fileUploadInput').click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("File selected:", file.name);
      // Add logic to handle the file upload (e.g., store in state, upload to server)
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
          <button
            onClick={handleFileUploadClick}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-400 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Upload Documents
            <FaUpload className="ml-2 h-4 w-4" />
          </button>
        </div>

        {/* Send Response Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSendResponse}
            className="px-6 py-2 border border-gray-400 rounded-md text-white bg-blue-500 hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
          >
            Send Response
            <FaArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
};

export default ResponsePage;