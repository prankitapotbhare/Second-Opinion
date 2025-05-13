"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDoctor } from '@/contexts/DoctorContext';
import FileUpload from './FileUpload';
import DropdownSelect from './DropdownSelect';

export default function DoctorDetailsForm() {
  const router = useRouter();
  const { completeProfile, setAvailability, loading, error } = useDoctor();
  
  // Form state
  const [formData, setFormData] = useState({
    specialization: '',
    experience: '',
    hospitalAffiliation: '',
    hospitalAddress: '',
    licenseNumber: '',
    issuingMedicalCouncil: '',
    languages: '',
    phone: '',
    email: '',
    emergencyContact: '',
    consultationFee: '',
    consultationAddress: '',
    location: '',
    bio: '',
    gender: '',
    degree: '',
  });
  
  // Files state
  const [files, setFiles] = useState({
    registrationCertificate: null,
    governmentId: null,
    profilePhoto: null,
  });
  
  // UI state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [workingDays, setWorkingDays] = useState([]);
  const [weeklyHoliday, setWeeklyHoliday] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const specializationOptions = [
    "Cardiology", "Dermatology", "Endocrinology", "Gastroenterology", "Neurology",
    "Oncology", "Orthopedics", "Pediatrics", "Psychiatry", "Radiology", "Surgery", "Urology"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validate numeric fields
    if (['phone', 'emergencyContact'].includes(name)) {
      // Only allow numeric input for phone numbers
      if (value === '' || /^\d*$/.test(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else if (name === 'consultationFee') {
      // Only allow numeric input for consultation fee
      if (value === '' || /^\d*$/.test(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      // For other fields, no validation needed
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files: uploadedFiles } = e.target;
    if (uploadedFiles && uploadedFiles[0]) {
      setFiles(prev => ({
        ...prev,
        [name]: uploadedFiles[0]
      }));
    }
  };

  const handleDeleteFile = (fileType) => {
    setFiles(prev => ({
      ...prev,
      [fileType]: null
    }));
  };

  const toggleDay = (day) => {
    setWorkingDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      'specialization', 'experience', 'hospitalAffiliation', 
      'licenseNumber', 'issuingMedicalCouncil', 'languages', 
      'phone', 'emergencyContact', 'consultationFee', 'bio', 'gender', 'degree'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'This field is required';
      }
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prepare data for API
    const profileData = {
      ...formData,
      languages: typeof formData.languages === 'string'
        ? formData.languages.split(',').map(lang => lang.trim()).filter(Boolean)
        : formData.languages,
    };

    // Create availability data object
    const availabilityData = {
      workingDays: workingDays.reduce((acc, day) => {
        acc[day.toLowerCase()] = true;
        return acc;
      }, {}),
      weeklyHoliday: weeklyHoliday.toLowerCase(),
      startTime: startTime,
      endTime: endTime
    };
    
    try {
      // First complete the profile
      const profileResponse = await completeProfile(profileData, files);
      
      // Then set availability if we have working days
      if (workingDays.length > 0) {
        await setAvailability(availabilityData);
      }
      
      setShowSuccessPopup(true);
      setTimeout(() => {
        router.push('/doctor/dashboard');
      }, 2000);
    } catch (err) {
      console.error("Error completing profile:", err);
      // Handle error state
    }
  };

  return (
    <div className="w-full px-4 py-6 md:px-8 lg:px-16">
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-gray-50 flex items-center justify-center px-4 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Your account has been successfully created!</h3>
              <p className="mt-2 text-sm text-gray-500">Redirecting to your dashboard...</p>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-3xl font-semibold mb-6">Doctor's Details</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Photo */}
        <div className="md:col-span-2">
          <FileUpload
            isProfilePhoto={true}
            name="profilePhoto"
            accept="image/*"
            onChange={handleFileChange}
            onDelete={handleDeleteFile}
            value={files.profilePhoto}
          />
        </div>

        {/* Specialization */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Specialization:<span className="text-red-500">*</span>
          </label>
          <DropdownSelect
            options={specializationOptions}
            value={formData.specialization}
            onChange={(value) => setFormData(prev => ({ ...prev, specialization: value }))}
            placeholder="Eg. Cardiology"
            required
          />
          {formErrors.specialization && <p className="text-red-500 text-xs mt-1">{formErrors.specialization}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender:<span className="text-red-500">*</span>
          </label>
          <DropdownSelect
            options={["Male", "Female", "Other"]}
            value={formData.gender}
            onChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
            placeholder="Select gender"
            required
          />
          {formErrors.gender && <p className="text-red-500 text-xs mt-1">{formErrors.gender}</p>}
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Years of Experience:<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Eg. 5 (in years)"
            required
          />
          {formErrors.experience && <p className="text-red-500 text-xs mt-1">{formErrors.experience}</p>}
        </div>

        {/* Degree */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Degree:<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="degree"
            value={formData.degree}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Eg. MBBS, MD, MS"
            required
          />
          {formErrors.degree && <p className="text-red-500 text-xs mt-1">{formErrors.degree}</p>}
        </div>

        {/* Hospital Affiliation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Hospital/Clinic Affiliation:<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="hospitalAffiliation"
            value={formData.hospitalAffiliation}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Eg. Apollo Hospitals, Chennai"
            required
          />
          {formErrors.hospitalAffiliation && <p className="text-red-500 text-xs mt-1">{formErrors.hospitalAffiliation}</p>}
        </div>

        {/* Hospital Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hospital Address:<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="hospitalAddress"
            value={formData.hospitalAddress}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Eg. AIIMS, Delhi, India"
          />
        </div>

        {/* License Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Medical License Number:<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Eg. 4456748"
            required
          />
          {formErrors.licenseNumber && <p className="text-red-500 text-xs mt-1">{formErrors.licenseNumber}</p>}
        </div>

        {/* Medical Council */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Issuing Medical Council:<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="issuingMedicalCouncil"
            value={formData.issuingMedicalCouncil}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Eg. MCI / USMLE"
            required
          />
          {formErrors.issuingMedicalCouncil && <p className="text-red-500 text-xs mt-1">{formErrors.issuingMedicalCouncil}</p>}
        </div>

        {/* Languages */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Add Languages:<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="languages"
            value={formData.languages}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Eg. English, Hindi"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Separate languages with commas (e.g., English, Hindi)</p>
          {formErrors.languages && <p className="text-red-500 text-xs mt-1">{formErrors.languages}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone number:<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Eg. 9843XXXXXX"
            required
            inputMode="numeric"
            pattern="[0-9]*"
          />
          {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address:<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Eg. you@example.com"
            required
          />
        </div>

        {/* Emergency Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Emergency Contact number:<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Eg. 7843XXXXXX"
            required
            inputMode="numeric"
            pattern="[0-9]*"
          />
          {formErrors.emergencyContact && <p className="text-red-500 text-xs mt-1">{formErrors.emergencyContact}</p>}
        </div>

        {/* Consultation Fee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Consultation Fee:<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="consultationFee"
            value={formData.consultationFee}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Eg. 500"
            required
            inputMode="numeric"
            pattern="[0-9]*"
          />
          {formErrors.consultationFee && <p className="text-red-500 text-xs mt-1">{formErrors.consultationFee}</p>}
        </div>

        {/* Consultation Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Consultation Address:<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="consultationAddress"
            value={formData.consultationAddress}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Eg. Fortis Hospital, Bandra, Mumbai"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location:<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Eg. Mumbai, India"
          />
        </div>

        {/* Registration Certificate */}
        <div className="md:col-span-2">
          <FileUpload
            label="Registration Certificate"
            name="registrationCertificate"
            accept=".pdf,.jpg,.jpeg,.png"
            required={true}
            isDragDrop={true}
            fileTypes="PDF, JPG, PNG (Max 5MB)"
            onChange={handleFileChange}
            onDelete={handleDeleteFile}
            value={files.registrationCertificate}
          />
        </div>

        {/* Government ID */}
        <div className="md:col-span-2">
          <FileUpload
            label="Government ID"
            name="governmentId"
            accept=".pdf,.jpg,.jpeg,.png"
            required={true}
            isDragDrop={true}
            fileTypes="PDF, JPG, PNG (Max 5MB)"
            onChange={handleFileChange}
            onDelete={handleDeleteFile}
            value={files.governmentId}
          />
        </div>

        {/* Bio */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Professional Bio:<span className="text-red-500">*</span>
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Write a brief professional bio highlighting your expertise, experience, and approach to patient care..."
            required
          />
          {formErrors.bio && <p className="text-red-500 text-xs mt-1">{formErrors.bio}</p>}
        </div>

        <div className='md:col-span-2 bg-white rounded-lg shadow-sm p-8 border border-gray-100'>
          {/* Working Days */}
          <div className="md:col-span-2 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Availability / Working Days:<span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ease-in-out ${
                    workingDays.includes(day)
                      ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Working Hours */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Working Hours:
            </label>
            <div className="grid grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-xs font-medium text-gray-500 mb-2">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="relative">
                <label className="block text-xs font-medium text-gray-500 mb-2">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Weekly Holiday */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weekly Holiday:
            </label>
            <div className="relative">
              <DropdownSelect
                options={['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']}
                value={weeklyHoliday}
                onChange={setWeeklyHoliday}
                placeholder="Select weekly holiday"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-end mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>

        {error && (
          <div className="md:col-span-2 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
