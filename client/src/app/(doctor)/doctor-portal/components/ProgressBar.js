"use client";

import React from 'react';

const ProgressBar = ({ activeStep }) => {
  const steps = [
    { number: 1, label: 'Personal' },
    { number: 2, label: 'Professional' },
    { number: 3, label: 'Education' },
    { number: 4, label: 'Consultation' },
    { number: 5, label: 'Other Info' },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.number < activeStep
                    ? "bg-indigo-600 text-white"
                    : step.number === activeStep
                      ? "bg-white border-2 border-indigo-600 text-indigo-600"
                      : "bg-white border-2 border-gray-300 text-gray-400"
                }`}
              >
                {step.number < activeStep ? (
                  <i className="fas fa-check"></i>
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs ${
                  step.number <= activeStep
                    ? "text-indigo-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 ${step.number < activeStep ? "bg-indigo-600" : "bg-gray-300"}`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar; 