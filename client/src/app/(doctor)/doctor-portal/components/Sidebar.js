"use client";

import React from 'react';

const Sidebar = ({ activeStep, setActiveStep }) => {
  const navItems = [
    { step: 1, label: 'Personal Information', icon: 'fas fa-user-md' },
    { step: 2, label: 'Professional Details', icon: 'fas fa-briefcase-medical' },
    { step: 3, label: 'Educational Background', icon: 'fas fa-graduation-cap' },
    { step: 4, label: 'Consultation Details', icon: 'fas fa-calendar-alt' },
    { step: 5, label: 'Other Information', icon: 'fas fa-info-circle' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
            <i className="fas fa-stethoscope"></i>
          </div>
          <h1 className="ml-3 text-xl font-bold">Doctor Portal</h1>
        </div>
      </div>
      <nav className="mt-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.step}>
              <button
                onClick={() => setActiveStep(item.step)}
                className={`w-full flex items-center px-6 py-3 text-sm ${
                  activeStep === item.step
                    ? "bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <i
                  className={`${item.icon} mr-3 ${
                    activeStep === item.step ? "text-indigo-600" : "text-gray-400"
                  }`}
                ></i>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-500">
          <i className="fas fa-question-circle mr-2"></i>
          <span>Need help? Contact support</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
