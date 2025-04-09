// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
"use client";
import React, { use, useState } from "react";
const DoctorSet = () => {
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
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const [isSpecializationDropdownOpen, setIsSpecializationDropdownOpen] =
    useState(false);
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
  const handleConsultationModeChange = (
    mode,
  ) => {
    setConsultationModes((prev) => ({
      ...prev,
      [mode]: !prev[mode],
    }));
  };
  const toggleGenderDropdown = () => {
    setIsGenderDropdownOpen(!isGenderDropdownOpen);
  };
  const toggleSpecializationDropdown = () => {
    setIsSpecializationDropdownOpen(!isSpecializationDropdownOpen);
  };
  const selectGender = (selectedGender) => {
    setGender(selectedGender);
    setIsGenderDropdownOpen(false);
  };
  const selectSpecialization = (selected) => {
    setSpecialization(selected);
    setIsSpecializationDropdownOpen(false);
  };
  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <div className="text-green-500 flex items-center">
                <i className="fas fa-check-circle mr-2"></i>
                <span>Changes saved</span>
              </div>
            </div>
            <p className="text-gray-500">
              Let's get your account up and running.
            </p>
            <div className="space-y-6 mt-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Picture <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <i className="fas fa-user text-3xl text-gray-400"></i>
                        )}
                      </div>
                      <label className="cursor-pointer">
                        <span className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 !rounded-button whitespace-nowrap">
                          Upload
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Dr. John Smith"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-left flex justify-between items-center !rounded-button whitespace-nowrap cursor-pointer"
                        onClick={toggleGenderDropdown}
                      >
                        <span>{gender || "Select gender"}</span>
                        <i
                          className={`fas fa-chevron-${isGenderDropdownOpen ? "up" : "down"} text-gray-400`}
                        ></i>
                      </button>
                      {isGenderDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200">
                          <ul className="py-1">
                            <li
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => selectGender("Male")}
                            >
                              Male
                            </li>
                            <li
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => selectGender("Female")}
                            >
                              Female
                            </li>
                            <li
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => selectGender("Other")}
                            >
                              Other
                            </li>
                            <li
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => selectGender("Prefer not to say")}
                            >
                              Prefer not to say
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <div className="mb-6">
                    <label
                      htmlFor="contactNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="contactNumber"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="doctor@example.com"
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="nationality"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nationality
                    </label>
                    <input
                      type="text"
                      id="nationality"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g. American, Canadian, etc."
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="languages"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Languages Spoken <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="languages"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="English, Spanish, etc."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Professional Details</h2>
            <p className="text-gray-500">
              Tell us about your medical qualifications and experience.
            </p>
            <div className="space-y-6 mt-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  <div className="mb-6">
                    <label
                      htmlFor="licenseNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Medical License Number{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="licenseNumber"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="ML12345678"
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="issuingMedicalCouncil"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Issuing Medical Council{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="issuingMedicalCouncil"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g. American Medical Association"
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="licenseExpiryDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Medical License Expiry Date{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="licenseExpiryDate"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="licenseDocument"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Upload License Document{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <label className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                      <span className="flex flex-col items-center space-y-2">
                        <i className="fas fa-cloud-upload-alt text-2xl text-gray-400"></i>
                        <span className="font-medium text-gray-600">
                          Drop files to upload or{" "}
                          <span className="text-indigo-600">browse</span>
                        </span>
                        <span className="text-xs text-gray-500">
                          PDF, JPG or PNG (max. 5MB)
                        </span>
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-left flex justify-between items-center !rounded-button whitespace-nowrap cursor-pointer"
                        onClick={toggleSpecializationDropdown}
                      >
                        <span>{specialization || "Select specialization"}</span>
                        <i
                          className={`fas fa-chevron-${isSpecializationDropdownOpen ? "up" : "down"} text-gray-400`}
                        ></i>
                      </button>
                      {isSpecializationDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                          <ul className="py-1">
                            {[
                              "Cardiology",
                              "Dermatology",
                              "Endocrinology",
                              "Gastroenterology",
                              "Neurology",
                              "Oncology",
                              "Orthopedics",
                              "Pediatrics",
                              "Psychiatry",
                              "Radiology",
                              "Surgery",
                              "Urology",
                            ].map((spec) => (
                              <li
                                key={spec}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => selectSpecialization(spec)}
                              >
                                {spec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="subSpecialization"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Sub-Specialization
                    </label>
                    <input
                      type="text"
                      id="subSpecialization"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g. Interventional Cardiology"
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <div className="mb-6">
                    <label
                      htmlFor="experience"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Years of Experience{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="experience"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="10"
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="previousWorkExperience"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Previous Work Experience
                    </label>
                    <textarea
                      id="previousWorkExperience"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Describe your previous work experience"
                    ></textarea>
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="affiliations"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Affiliated Hospitals/Clinics{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="affiliations"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="List your current hospital affiliations"
                    ></textarea>
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="hospitalAddress"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Hospital Address
                    </label>
                    <textarea
                      id="hospitalAddress"
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter your primary hospital address"
                    ></textarea>
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="consultationAddress"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Consultation Address
                    </label>
                    <textarea
                      id="consultationAddress"
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter your consultation clinic address if different from hospital"
                    ></textarea>
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Professional Bio
                    </label>
                    <textarea
                      id="bio"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Brief overview of your expertise and achievements"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Educational Background</h2>
              <div className="text-green-500 flex items-center">
                <i className="fas fa-check-circle mr-2"></i>
                <span>Changes saved</span>
              </div>
            </div>
            <p className="text-gray-500">
              Share your academic qualifications and certifications.
            </p>
            <div className="space-y-6 mt-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  <div className="mb-6">
                    <label
                      htmlFor="medicalDegree"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Medical Degree <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="medicalDegree"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="MD, MBBS, etc."
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="institution"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Institution <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="institution"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Harvard Medical School"
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="graduationYear"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Year of Graduation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="graduationYear"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="2010"
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="certificateDocuments"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Upload Degree Certificates{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <label className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                      <span className="flex flex-col items-center space-y-2">
                        <i className="fas fa-cloud-upload-alt text-2xl text-gray-400"></i>
                        <span className="font-medium text-gray-600">
                          Drop files to upload or{" "}
                          <span className="text-indigo-600">browse</span>
                        </span>
                        <span className="text-xs text-gray-500">
                          PDF, JPG or PNG (max. 5MB)
                        </span>
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple
                      />
                    </label>
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <div className="mb-6">
                    <label
                      htmlFor="additionalCertifications"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Additional Certifications
                    </label>
                    <textarea
                      id="additionalCertifications"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="List any additional certifications or specializations"
                    ></textarea>
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="professionalMembership"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Professional Membership
                    </label>
                    <textarea
                      id="professionalMembership"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="List professional associations or societies you belong to"
                    ></textarea>
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="awardsRecognition"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Awards and Recognition
                    </label>
                    <textarea
                      id="awardsRecognition"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="List any awards, honors or recognition received"
                    ></textarea>
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="publications"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Publications & Research
                    </label>
                    <textarea
                      id="publications"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="List any published papers or research work"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Consultation Details</h2>
            <p className="text-gray-500">
              Set up your consultation preferences and availability.
            </p>
            <div className="space-y-6 mt-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Available Consultation Modes{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          id="video"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          checked={consultationModes.video}
                          onChange={() => handleConsultationModeChange("video")}
                        />
                        <label
                          htmlFor="video"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Video Consultation
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="chat"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          checked={consultationModes.chat}
                          onChange={() => handleConsultationModeChange("chat")}
                        />
                        <label
                          htmlFor="chat"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Chat Consultation
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="writtenReport"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          checked={consultationModes.writtenReport}
                          onChange={() =>
                            handleConsultationModeChange("writtenReport")
                          }
                        />
                        <label
                          htmlFor="writtenReport"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Written Report
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="consultationFee"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Consultation Fee (USD){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="consultationFee"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="100"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Opening & Closing Time{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="openingTime"
                          className="block text-xs text-gray-500 mb-1"
                        >
                          Opening Time
                        </label>
                        <input
                          type="time"
                          id="openingTime"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="closingTime"
                          className="block text-xs text-gray-500 mb-1"
                        >
                          Closing Time
                        </label>
                        <input
                          type="time"
                          id="closingTime"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Break Time{" "}
                      <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="breakStart"
                          className="block text-xs text-gray-500 mb-1"
                        >
                          Start Time
                        </label>
                        <input
                          type="time"
                          id="breakStart"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="breakEnd"
                          className="block text-xs text-gray-500 mb-1"
                        >
                          End Time
                        </label>
                        <input
                          type="time"
                          id="breakEnd"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="responseTime"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Response Time{" "}
                      <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <select
                      id="responseTime"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select response time</option>
                      <option value="within1hour">Within 1 hour</option>
                      <option value="within3hours">Within 3 hours</option>
                      <option value="within6hours">Within 6 hours</option>
                      <option value="within12hours">Within 12 hours</option>
                      <option value="within24hours">Within 24 hours</option>
                      <option value="within48hours">Within 48 hours</option>
                    </select>
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <div className="mb-6">
                    <label
                      htmlFor="availability"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Availability & Working Hours{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="availability"
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Monday: 9 AM - 5 PM&#10;Tuesday: 9 AM - 5 PM&#10;Wednesday: 9 AM - 5 PM&#10;Thursday: 9 AM - 5 PM&#10;Friday: 9 AM - 5 PM"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Other Information</h2>
              <div className="text-green-500 flex items-center">
                <i className="fas fa-check-circle mr-2"></i>
                <span>Changes saved</span>
              </div>
            </div>
            <p className="text-gray-500">
              Additional information to complete your profile.
            </p>
            <div className="space-y-6 mt-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  <div className="mb-6">
                    <label
                      htmlFor="governmentDocument"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Upload Government Document{" "}
                      <span className="text-red-500">*</span>
                      <span className="text-xs text-gray-500 ml-1">
                        (Aadhar, PAN Card, Passport)
                      </span>
                    </label>
                    <div className="mt-2">
                      {governmentDocument ? (
                        <div className="relative">
                          <div className="border border-gray-300 rounded-md p-2 flex items-center">
                            <i className="fas fa-file-pdf text-red-500 text-xl mr-2"></i>
                            <span className="text-sm truncate">
                              Document uploaded
                            </span>
                            <button
                              type="button"
                              onClick={() => setGovernmentDocument(null)}
                              className="ml-auto text-gray-400 hover:text-gray-600"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                          <span className="flex flex-col items-center space-y-2">
                            <i className="fas fa-cloud-upload-alt text-2xl text-gray-400"></i>
                            <span className="font-medium text-gray-600">
                              Drop files to upload or{" "}
                              <span className="text-indigo-600">browse</span>
                            </span>
                            <span className="text-xs text-gray-500">
                              PDF, JPG or PNG (max. 5MB)
                            </span>
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleDocumentUpload}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="whyChooseYou"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Why Should Patients Choose You?{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="whyChooseYou"
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Describe what makes you unique as a healthcare provider and why patients should choose you for their care."
                    ></textarea>
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <div className="mb-6">
                    <label
                      htmlFor="patientMessage"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Personal Patient-Centric Message{" "}
                      <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <textarea
                      id="patientMessage"
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Share a personal message to your patients about your approach to care and what they can expect when consulting with you."
                    ></textarea>
                    <p className="mt-2 text-xs text-gray-500">
                      This message will be displayed on your public profile to
                      help patients connect with you on a more personal level.
                    </p>
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="additionalInfo"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Any Additional Information{" "}
                      <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <textarea
                      id="additionalInfo"
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Any other information you would like to share that wasn't covered in the previous sections."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
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
              <li>
                <button
                  onClick={() => setActiveStep(1)}
                  className={`w-full flex items-center px-6 py-3 text-sm ${activeStep === 1 ? "bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <i
                    className={`fas fa-user-md mr-3 ${activeStep === 1 ? "text-indigo-600" : "text-gray-400"}`}
                  ></i>
                  <span>Personal Information</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveStep(2)}
                  className={`w-full flex items-center px-6 py-3 text-sm ${activeStep === 2 ? "bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <i
                    className={`fas fa-briefcase-medical mr-3 ${activeStep === 2 ? "text-indigo-600" : "text-gray-400"}`}
                  ></i>
                  <span>Professional Details</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveStep(3)}
                  className={`w-full flex items-center px-6 py-3 text-sm ${activeStep === 3 ? "bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <i
                    className={`fas fa-graduation-cap mr-3 ${activeStep === 3 ? "text-indigo-600" : "text-gray-400"}`}
                  ></i>
                  <span>Educational Background</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveStep(4)}
                  className={`w-full flex items-center px-6 py-3 text-sm ${activeStep === 4 ? "bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <i
                    className={`fas fa-calendar-alt mr-3 ${activeStep === 4 ? "text-indigo-600" : "text-gray-400"}`}
                  ></i>
                  <span>Consultation Details</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveStep(5)}
                  className={`w-full flex items-center px-6 py-3 text-sm ${activeStep === 5 ? "bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <i
                    className={`fas fa-info-circle mr-3 ${activeStep === 5 ? "text-indigo-600" : "text-gray-400"}`}
                  ></i>
                  <span>Other Information</span>
                </button>
              </li>
            </ul>
          </nav>
          <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-500">
              <i className="fas fa-question-circle mr-2"></i>
              <span>Need help? Contact support</span>
            </div>
          </div>
        </div>
        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((step) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step < activeStep
                            ? "bg-indigo-600 text-white"
                            : step === activeStep
                              ? "bg-white border-2 border-indigo-600 text-indigo-600"
                              : "bg-white border-2 border-gray-300 text-gray-400"
                        }`}
                      >
                        {step < activeStep ? (
                          <i className="fas fa-check"></i>
                        ) : (
                          <span>{step}</span>
                        )}
                      </div>
                      <span
                        className={`mt-2 text-xs ${
                          step <= activeStep
                            ? "text-indigo-600 font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        {step === 1 && "Personal"}
                        {step === 2 && "Professional"}
                        {step === 3 && "Education"}
                        {step === 4 && "Consultation"}
                        {step === 5 && "Other Info"}
                      </span>
                    </div>
                    {step < 5 && (
                      <div
                        className={`flex-1 h-1 mx-2 ${step < activeStep ? "bg-indigo-600" : "bg-gray-300"}`}
                      ></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            {/* Form content */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              {renderStep()}
            </div>
            {/* Navigation buttons */}
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
                    // Submit form
                    alert("Form submitted successfully!");
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
          </div>
        </div>
      </div>
    </div>
  );
};
export default DoctorSet;
