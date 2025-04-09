"use client";

import React from 'react';

const Navigation = ({ activeStep, setActiveStep }) => {
  const handleSubmit = () => {
    // Submit form
    alert("Form submitted successfully!");
  };

  return (
    <div className="flex justify-between">
      <button
        onClick={() => setActiveStep((prev) => Math.max(prev - 1, 1))}
        disabled={activeStep === 1}
        className={`px-6 py-3 rounded-md text-sm font-medium !rounded-button whitespace-nowrap ${
          activeStep === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
        }`}
      >
        <i className="fas fa-arrow-left mr-2"></i> Previous
      </button>
      <button
        onClick={() => {
          if (activeStep < 5) {
            setActiveStep((prev) => prev + 1);
          } else {
            handleSubmit();
          }
        }}
        className="px-6 py-3 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 !rounded-button whitespace-nowrap cursor-pointer"
      >
        {activeStep < 5 ? (
          <>
            Next <i className="fas fa-arrow-right ml-2"></i>
          </>
        ) : (
          <>
            Submit <i className="fas fa-check ml-2"></i>
          </>
        )}
      </button>
    </div>
  );
};

export default Navigation; 