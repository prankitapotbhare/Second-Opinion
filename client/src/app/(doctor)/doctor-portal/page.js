// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
"use client";
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ProgressBar from "./components/ProgressBar";
import Navigation from "./components/Navigation";
import PersonalInfoForm from "./components/PersonalInfoForm";
import ProfessionalDetailsForm from "./components/ProfessionalDetailsForm";
import EducationalBackgroundForm from "./components/EducationalBackgroundForm";
import ConsultationDetailsForm from "./components/ConsultationDetailsForm";
import OtherInformationForm from "./components/OtherInformationForm";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserMd, 
  faBriefcaseMedical, 
  faGraduationCap, 
  faCalendarAlt, 
  faInfoCircle, 
  faStethoscope, 
  faQuestionCircle,
  faTimes,
  faBars
} from '@fortawesome/free-solid-svg-icons';

const DoctorPortal = () => {
  // State management
  const [activeStep, setActiveStep] = useState(1);
  const [governmentDocument, setGovernmentDocument] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [gender, setGender] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [consultationModes, setConsultationModes] = useState({
    video: false,
    chat: false,
    writtenReport: false,
  });

  // Handlers
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result || "");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setGovernmentDocument(event.target?.result || "");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConsultationModeChange = (mode) => {
    setConsultationModes((prev) => ({
      ...prev,
      [mode]: !prev[mode],
    }));
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Render the current step form
  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <PersonalInfoForm
            profileImage={profileImage}
            handleImageUpload={handleImageUpload}
            gender={gender}
            setGender={setGender}
          />
        );
      case 2:
        return (
          <ProfessionalDetailsForm
            specialization={specialization}
            setSpecialization={setSpecialization}
          />
        );
      case 3:
        return <EducationalBackgroundForm />;
      case 4:
        return (
          <ConsultationDetailsForm
            consultationModes={consultationModes}
            handleConsultationModeChange={handleConsultationModeChange}
          />
        );
      case 5:
        return (
          <OtherInformationForm
            governmentDocument={governmentDocument}
            handleDocumentUpload={handleDocumentUpload}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md">
              <FontAwesomeIcon icon={faStethoscope} className="text-lg" />
            </div>
            <h1 className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">Doctor Portal</h1>
          </div>
          <button 
            onClick={toggleSidebar}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-600 hover:bg-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:text-indigo-600"
            aria-label={showSidebar ? "Close menu" : "Open menu"}
          >
            <div className="relative w-6 h-6 flex items-center justify-center overflow-hidden">
              <FontAwesomeIcon 
                icon={faBars} 
                className={`absolute transition-all duration-300 transform ${
                  showSidebar ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                }`}
              />
              <FontAwesomeIcon 
                icon={faTimes} 
                className={`absolute transition-all duration-300 transform ${
                  showSidebar ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Sidebar - hidden on mobile unless toggled */}
      <div 
        className={`fixed inset-0 z-20 md:relative transition-all duration-300 ease-in-out ${
          showSidebar ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'
        }`}
      >
        {/* Backdrop overlay with blur effect */}
        <div 
          className="md:hidden absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
          style={{ opacity: showSidebar ? 1 : 0 }}
          onClick={toggleSidebar}
        ></div>
        
        {/* Sidebar container with slide animation */}
        <div 
          className={`md:w-64 w-4/5 max-w-xs h-full bg-white md:bg-transparent relative z-30 shadow-xl md:shadow-none
                     transition-transform duration-300 ease-out ${
                       showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                     }`}
        >
          <Sidebar 
            activeStep={activeStep} 
            setActiveStep={setActiveStep} 
            onClose={toggleSidebar} 
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <ProgressBar activeStep={activeStep} />
          {renderStepContent()}
          <div className="mt-8">
            <Navigation activeStep={activeStep} setActiveStep={setActiveStep} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPortal;
