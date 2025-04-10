"use client";

import React from 'react';
// Replace FontAwesome with React Icons
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa';

const Navigation = ({ activeStep, setActiveStep, onSubmit }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
      <button
        onClick={() => setActiveStep((prev) => Math.max(prev - 1, 1))}
        disabled={activeStep === 1}
        className={`px-4 sm:px-6 py-3 rounded-md text-sm font-medium !rounded-button whitespace-nowrap ${
          activeStep === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
        }`}
      >
        <FaArrowLeft className="mr-2 inline" /> Previous
      </button>
      <button
        onClick={() => {
          if (activeStep < 5) {
            setActiveStep((prev) => prev + 1);
          } else {
            if (typeof onSubmit === 'function') {
              onSubmit();
            }
          }
        }}
        className="px-4 sm:px-6 py-3 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 !rounded-button whitespace-nowrap cursor-pointer"
      >
        {activeStep < 5 ? (
          <>
            Next <FaArrowRight className="ml-2 inline" />
          </>
        ) : (
          <>
            Submit <FaCheck className="ml-2 inline" />
          </>
        )}
      </button>
    </div>
  );
};

export default Navigation;