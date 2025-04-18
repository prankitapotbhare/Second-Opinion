// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
"use client";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./components/Sidebar";
import ProgressBar from "./components/ProgressBar";
import Navigation from "./components/Navigation";
import PersonalInfoForm from "./components/PersonalInfoForm";
import ProfessionalDetailsForm from "./components/ProfessionalDetailsForm";
import EducationalBackgroundForm from "./components/EducationalBackgroundForm";
import ConsultationDetailsForm from "./components/ConsultationDetailsForm";
import OtherInformationForm from "./components/OtherInformationForm";
import SubmissionMessage from "./components/SubmissionMessage";

// Replace FontAwesome with React Icons
import { FaStethoscope } from 'react-icons/fa';

const DoctorPortal = () => {
  const router = useRouter();
  
  // State management
  const [activeStep, setActiveStep] = useState(1);
  const [governmentDocument, setGovernmentDocument] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [gender, setGender] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const [consultationModes, setConsultationModes] = useState({
    video: false,
    chat: false,
    writtenReport: false,
  });
  // Add state for submission message
  const [showSubmissionMessage, setShowSubmissionMessage] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

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

  // Improved submit handler
  const handleSubmit = useCallback(() => {
    console.log("Form submitted!");
    
    // Here you would typically send the form data to your API
    // For now, we'll just simulate a successful submission
    
    // Mark form as submitted to prevent duplicate submissions
    setFormSubmitted(true);
    
    // Show the submission message
    setShowSubmissionMessage(true);
  }, []);

  // Handle message close with direct navigation if needed
  const handleMessageClose = useCallback(() => {
    setShowSubmissionMessage(false);
    
    // If form was successfully submitted, we could navigate directly here too
    if (formSubmitted) {
      // This is a fallback in case the redirect in SubmissionMessage fails
      setTimeout(() => {
        router.push("/doctor/dashboard");
      }, 200);
    }
  }, [formSubmitted, router]);

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
        return <PersonalInfoForm />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <Sidebar.MobileMenuButton 
            isOpen={showSidebar} 
            onToggle={setShowSidebar} 
            isMenuHovered={isMenuHovered}
            setIsMenuHovered={setIsMenuHovered}
          />
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md">
              <FaStethoscope className="text-lg" />
            </div>
            <h1 className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">Doctor Portal</h1>
          </div>
          <div className="w-10 h-10"></div> {/* Empty div for balanced spacing */}
        </div>
      </div>

      {/* Main content wrapper - added flex-grow to ensure it takes full height */}
      <div className="flex flex-grow w-full">
        {/* Sidebar component - now in the flex container */}
        <div className="md:sticky md:top-0 md:h-screen">
          <Sidebar 
            activeStep={activeStep} 
            setActiveStep={setActiveStep} 
            isOpen={showSidebar}
            onToggle={setShowSidebar}
          />
        </div>

        {/* Main content - added flex-grow to ensure it takes full height */}
        <div className="flex-1 flex flex-col md:ml-0 mt-20 md:mt-0">
          <div className="p-6 md:p-8 max-w-6xl mx-auto w-full">
            <ProgressBar activeStep={activeStep} />
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-6 transition-all duration-300 hover:shadow-md">
              {renderStepContent()}
            </div>
            <Navigation activeStep={activeStep} setActiveStep={setActiveStep} onSubmit={handleSubmit}/>
          </div>
        </div>
      </div>

      {/* Add redirectPath prop to SubmissionMessage */}
      <SubmissionMessage
        show={showSubmissionMessage}
        type="success"
        message="Your profile has been submitted successfully! We will review your information and get back to you soon."
        onClose={handleMessageClose}
        redirectPath="/doctor/dashboard"
        autoClose={false} // Disable auto-close to let user read the message
      />
    </div>
  );
};

export default DoctorPortal;
