"use client";

import React, { useState, useEffect } from 'react';
// Replace FontAwesome with React Icons
import { 
  FaUserMd, 
  FaBriefcaseMedical, 
  FaGraduationCap, 
  FaCalendarAlt, 
  FaInfoCircle, 
  FaStethoscope, 
  FaQuestionCircle,
  FaTimes,
  FaChevronRight,
  FaBars
} from 'react-icons/fa';

const Sidebar = ({ activeStep, setActiveStep, isOpen, onToggle }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isTabSwitching, setIsTabSwitching] = useState(false);
  
  const navItems = [
    { step: 1, label: 'Personal Information', icon: FaUserMd },
    { step: 2, label: 'Professional Details', icon: FaBriefcaseMedical },
    { step: 3, label: 'Educational Background', icon: FaGraduationCap },
    { step: 4, label: 'Consultation Details', icon: FaCalendarAlt },
    { step: 5, label: 'Other Information', icon: FaInfoCircle },
  ];

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onToggle(false);
      setIsClosing(false);
    }, 300);
  };

  // Handle tab switching without transitions
  const handleTabSwitch = (step) => {
    setActiveStep(step);
    // For mobile view, close the sidebar after tab selection
    if (window.innerWidth < 768 && onToggle) {
      onToggle(false);
    }
  };

  // Render the sidebar container with backdrop
  const renderSidebarContainer = () => (
    <div className={`fixed inset-0 z-20 md:h-screen md:relative transition-all duration-300 ease-in-out ${
      isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'
    }`}>
      {/* Backdrop overlay with blur effect */}
      <div 
        className={`md:hidden absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      ></div>
      
      {/* Sidebar container with slide animation */}
      <div 
        className={`md:w-72 w-full max-w-xs h-full fixed inset-y-0 left-0 md:h-screen md:relative bg-white md:bg-transparent z-30 shadow-xl md:shadow-none
                   transition-transform duration-300 ease-out ${
                     isOpen && !isClosing ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                   }`}
      >
        {renderSidebarContent()}
      </div>
    </div>
  );

  // Render the actual sidebar content
  const renderSidebarContent = () => (
    <div 
      className={`w-full md:w-76 bg-white border-r border-gray-200 flex flex-col h-full fixed inset-y-0 left-0 md:relative md:h-screen
                overflow-y-auto transition-all duration-300 ease-in-out
                ${isClosing && !isTabSwitching ? 'opacity-0 translate-x-[-10px]' : 'opacity-100 translate-x-0'}
                shadow-lg md:shadow-md hover:md:shadow-lg`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Mobile header with close button */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md transform transition-all duration-300 hover:scale-105">
            <FaStethoscope className="text-lg" />
          </div>
          <h1 className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">Doctor Portal</h1>
        </div>
        <button 
          onClick={handleClose} 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:text-indigo-600 overflow-hidden cursor-pointer"
          aria-label="Close menu"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="relative w-6 h-6 flex items-center justify-center">
            <FaTimes 
              className="absolute transition-all duration-300 transform rotate-0 hover:rotate-90"
              style={{ opacity: 1 }}
            />
          </div>
        </button>
      </div>
      
      {/* Desktop header */}
      <div className="hidden md:flex p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md transform transition-all duration-500 ${isHovering ? 'scale-110' : 'scale-100'}`}>
            <FaStethoscope className={`text-lg transition-all duration-500 ${isHovering ? 'rotate-12' : 'rotate-0'}`} />
          </div>
          <h1 className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600 transition-all duration-300">Doctor Portal</h1>
        </div>
      </div>
      
      {/* Navigation - increased padding for wider sidebar */}
      <nav className="mt-4 md:mt-6 flex-1 overflow-y-auto px-3">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.step} className="px-2">
              <button
                onClick={() => handleTabSwitch(item.step)}
                onMouseEnter={() => setHoveredItem(item.step)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-full flex items-center px-5 py-3.5 text-sm rounded-xl transition-all duration-300 ease-in-out cursor-pointer ${
                  activeStep === item.step
                    ? "bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-600 font-medium shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:shadow-sm"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-all duration-300 ${
                  activeStep === item.step 
                    ? "bg-indigo-100 text-indigo-600" 
                    : hoveredItem === item.step
                    ? "bg-gray-200 text-indigo-500"
                    : "bg-gray-100 text-gray-400"
                }`}>
                  {React.createElement(item.icon, {
                    className: `transition-all duration-300 ${
                      hoveredItem === item.step && activeStep !== item.step ? "scale-110" : ""
                    } ${activeStep === item.step ? "animate-pulse-subtle" : ""}`,
                    style: { width: '1em' }
                  })}
                </div>
                <span className={`transition-all duration-300 ${
                  hoveredItem === item.step && activeStep !== item.step ? "translate-x-1" : "translate-x-0"
                }`}>{item.label}</span>
                {activeStep === item.step ? (
                  <span className="ml-auto w-1.5 h-6 rounded-full bg-gradient-to-b from-indigo-500 to-blue-600 animate-pulse"></span>
                ) : (
                  <FaChevronRight 
                    className={`ml-auto text-gray-300 transition-all duration-300 ${
                      hoveredItem === item.step ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                    }`}
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Progress indicator at bottom */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Profile completion</span>
          <span className="font-medium">{Math.min(activeStep * 20, 100)}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min(activeStep * 20, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {renderSidebarContainer()}
    </>
  );
};

// Export both the component and the mobile menu button
Sidebar.MobileMenuButton = ({ isOpen, onToggle, isMenuHovered, setIsMenuHovered }) => {
  return (
    <button 
      onClick={() => onToggle(!isOpen)}
      onMouseEnter={() => setIsMenuHovered(true)}
      onMouseLeave={() => setIsMenuHovered(false)}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:text-indigo-600 overflow-hidden cursor-pointer"
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        <FaBars 
          className={`absolute transition-all duration-300 transform ${
            isOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
          } ${isMenuHovered && !isOpen ? 'scale-110' : ''}`}
        />
        <FaTimes 
          className={`absolute transition-all duration-300 transform ${
            isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'
          } ${isMenuHovered && isOpen ? 'rotate-90' : ''}`}
        />
      </div>
    </button>
  );
};

export default Sidebar;
