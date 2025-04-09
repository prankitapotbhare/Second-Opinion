"use client";

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserMd, 
  faBriefcaseMedical, 
  faGraduationCap, 
  faCalendarAlt, 
  faInfoCircle, 
  faStethoscope, 
  faQuestionCircle 
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ activeStep, setActiveStep }) => {
  const navItems = [
    { step: 1, label: 'Personal Information', icon: faUserMd },
    { step: 2, label: 'Professional Details', icon: faBriefcaseMedical },
    { step: 3, label: 'Educational Background', icon: faGraduationCap },
    { step: 4, label: 'Consultation Details', icon: faCalendarAlt },
    { step: 5, label: 'Other Information', icon: faInfoCircle },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
            <FontAwesomeIcon icon={faStethoscope} />
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
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`mr-3 ${
                    activeStep === item.step ? "text-indigo-600" : "text-gray-400"
                  }`}
                />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-500">
          <FontAwesomeIcon icon={faQuestionCircle} className="mr-2" />
          <span>Need help? Contact support</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
