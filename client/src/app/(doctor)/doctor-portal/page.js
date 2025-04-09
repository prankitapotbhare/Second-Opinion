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

const DoctorPortal = () => {
  // State management
  const [activeStep, setActiveStep] = useState(1);
  const [governmentDocument, setGovernmentDocument] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [gender, setGender] = useState("");
  const [specialization, setSpecialization] = useState("");
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
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar activeStep={activeStep} setActiveStep={setActiveStep} />
        
        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Progress indicator */}
            <ProgressBar activeStep={activeStep} />
            
            {/* Form content */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              {renderStepContent()}
            </div>
            
            {/* Navigation buttons */}
            <Navigation activeStep={activeStep} setActiveStep={setActiveStep} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPortal;
