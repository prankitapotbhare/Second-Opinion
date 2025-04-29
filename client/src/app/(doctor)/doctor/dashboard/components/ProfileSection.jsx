import React, { useState, useEffect } from 'react';
import { useDoctor } from '@/contexts/DoctorContext';
import {
  FaCamera,
  FaEnvelope,
  FaPhoneAlt,
  FaUpload,
  FaChevronDown,
  FaEdit,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";
import { showSuccessToast, showErrorToast } from '@/utils/toast';

const ProfileSection = () => {
  const { doctor, loading, error, updateProfile } = useDoctor();
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [languagesInput, setLanguagesInput] = useState('');
  
  // Initialize form data when doctor data is loaded
  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || '',
        gender: doctor.gender || 'Male',
        phone: doctor.phone || '',
        email: doctor.email || '',
        specialization: doctor.specialization || '',
        experience: doctor.experience || '',
        hospitalAffiliation: doctor.hospitalAffiliation || '',
        hospitalAddress: doctor.hospitalAddress || '',
        licenseNumber: doctor.licenseNumber || '',
        issuingMedicalCouncil: doctor.issuingMedicalCouncil || '',
        consultationFee: doctor.consultationFee || '',
        emergencyContact: doctor.emergencyContact || '',
        consultationAddress: doctor.consultationAddress || '',
        location: doctor.location || '',
        bio: doctor.bio || '',
        languages: doctor.languages || [],
      });
      
      // Set languages input as a comma-separated string
      if (doctor.languages && Array.isArray(doctor.languages)) {
        setLanguagesInput(doctor.languages.join(', '));
      }
    }
  }, [doctor]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle languages input change
  const handleLanguagesChange = (e) => {
    const { value } = e.target;
    setLanguagesInput(value);
    
    // Update formData with the array of languages
    const languagesArray = value.split(',').map(lang => lang.trim()).filter(lang => lang !== '');
    setFormData(prev => ({
      ...prev,
      languages: languagesArray
    }));
  };

  // Handle file changes
  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    if (fileList && fileList.length > 0) {
      setFiles(prev => ({
        ...prev,
        [name]: fileList[0]
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUpdateSuccess(false);
    setUpdateError(null);

    // Ensure languages is an array before sending
    let submitData = { ...formData };
    if (typeof submitData.languages === 'string') {
      submitData.languages = submitData.languages.split(',').map(lang => lang.trim()).filter(Boolean);
    }

    try {
      await updateProfile(submitData, files);
      setUpdateSuccess(true);
      showSuccessToast('Profile updated successfully!');
      // Reset file inputs after successful upload
      setFiles({});
      // Reset file input elements
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach(input => {
        input.value = '';
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (err) {
      setUpdateError(err.message || 'Failed to update profile');
      showErrorToast(err.message || 'Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading && !doctor) {
    return <div className="flex justify-center items-center h-full">
      <FaSpinner className="animate-spin text-blue-500 text-2xl mr-2" />
      <span>Loading profile data...</span>
    </div>;
  }

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
      {/* Status Messages */}
      {updateSuccess && (
        <div className="mb-4 p-4 bg-green-100 border border-green-200 text-green-700 rounded-md flex items-center">
          <FaCheck className="mr-2" />
          Profile updated successfully!
        </div>
      )}
      
      {(updateError || error) && (
        <div className="mb-4 p-4 bg-red-100 border border-red-200 text-red-700 rounded-md">
          {updateError || error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100 mb-8">
          <h2 className="text-xl font-medium text-gray-800 mb-6">Personal Information</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="col-span-1 lg:col-span-2 flex flex-col sm:flex-row items-start gap-6 mb-4">
              <div className="relative">
                <img
                  src={doctor?.photoURL || "https://public.readdy.ai/ai/img_res/fc4e928c7d3a4337c7173c0e07f786b5.jpg"}
                  alt="Doctor profile"
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover object-top"
                />
                <label htmlFor="profilePhoto" className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-md cursor-pointer">
                  <FaCamera />
                  <input 
                    type="file" 
                    id="profilePhoto" 
                    name="profilePhoto" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-800">{formData.name || 'Dr. Jane Doe'}</h3>
                <p className="text-sm text-gray-500 mb-2">{formData.specialization || 'Cardiologist'}</p>
                <p className="text-sm text-gray-600 mb-1 flex items-center">
                  <FaEnvelope className="mr-2 text-gray-400" />
                  {formData.email || 'jane.doe@healthplatform.com'}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <FaPhoneAlt className="mr-2 text-gray-400" />
                  {formData.phone || '+1 (555) 123-4567'}
                </p>
              </div>
            </div>

            {/* Inputs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                value={formData.name || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div className="flex flex-wrap gap-4">
                {["Female", "Male", "Other"].map((label, i) => (
                  <label key={i} className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value={label}
                      className="h-4 w-4 text-blue-600 border-gray-300"
                      checked={formData.gender === label}
                      onChange={handleInputChange}
                    />
                    <span className="ml-2 text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
              <input
                type="tel"
                name="phone"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                value={formData.phone || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                value={formData.email || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </section>

        {/* Doctor's Details */}
        <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Professional Information */}
            <div className="col-span-1 lg:col-span-2">
              <h3 className="text-xl font-medium text-gray-800">Professional Information</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialization </label>
              <div className="relative">
                <select 
                  name="specialization"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700 appearance-none"
                  value={formData.specialization || ""}
                  onChange={handleInputChange}
                >
                  <option value="">Select Specialization</option>
                  <option>Cardiology</option>
                  <option>Neurology</option>
                  <option>Pediatrics</option>
                  <option>Dermatology</option>
                  <option>Orthopedics</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <FaChevronDown className="text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience </label>
              <input
                type="text"
                name="experience"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                placeholder="Eg. 5,8,10"
                value={formData.experience || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Hospital/Clinic Affiliation </label>
              <input
                type="text"
                name="hospitalAffiliation"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                placeholder="Eg. Apollo Hospitals, Chennai"
                value={formData.hospitalAffiliation || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Address</label>
              <input
                type="text"
                name="hospitalAddress"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                placeholder="Eg. AIIMS Delhi, India"
                value={formData.hospitalAddress || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medical License Number </label>
              <input
                type="text"
                name="licenseNumber"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                placeholder="Eg. 4455648"
                value={formData.licenseNumber || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Medical Council </label>
              <input
                type="text"
                name="issuingMedicalCouncil"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                placeholder="Eg. Medical Council of India (MCI) / USMLE (USA)"
                value={formData.issuingMedicalCouncil || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee </label>
              <input
                type="text"
                name="consultationFee"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                placeholder="Eg. ₹500"
                value={formData.consultationFee || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Languages Spoken</label>
              <input
                type="text"
                name="languages"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                placeholder="Eg. English, Hindi, Spanish"
                value={languagesInput}
                onChange={handleLanguagesChange}
              />
              <p className="text-xs text-gray-500 mt-1">Separate languages with commas (e.g., English, Hindi)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Registration Certificate Upload </label>
              <div className="relative">
                <input
                  type="file"
                  id="registrationCertificate"
                  name="registrationCertificate"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label 
                  htmlFor="registrationCertificate" 
                  className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700 cursor-pointer hover:bg-gray-50"
                >
                  <span className="text-gray-500">
                    {files.registrationCertificate ? files.registrationCertificate.name : "Upload PDF/JPG"}
                  </span>
                  <FaUpload className="text-blue-500" />
                </label>
                <div className="mt-2 text-xs text-gray-500">
                  Supported formats: PDF, JPG, JPEG, PNG (Max size: 100MB)
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Government ID Upload </label>
              <div className="relative">
                <input
                  type="file"
                  id="governmentId"
                  name="governmentId"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label 
                  htmlFor="governmentId" 
                  className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700 cursor-pointer hover:bg-gray-50"
                >
                  <span className="text-gray-500">
                    {files.governmentId ? files.governmentId.name : "Upload PDF/JPG"}
                  </span>
                  <FaUpload className="text-blue-500" />
                </label>
                <div className="mt-2 text-xs text-gray-500">
                  Supported formats: PDF, JPG, JPEG, PNG (Max size: 100MB)
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact number </label>
              <input
                type="tel"
                name="emergencyContact"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                placeholder="Eg. 784XXXXXXX"
                value={formData.emergencyContact || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Address</label>
              <input
                type="text"
                name="consultationAddress"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                placeholder="Eg. Fortis Hospital, Bandra, Mumbai"
                value={formData.consultationAddress || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location:</label>
              <input
                type="text"
                name="location"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                placeholder="Eg. Mumbai, India"
                value={formData.location || ""}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="col-span-1 lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio </label>
              <textarea
                name="bio"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700 h-32"
                placeholder="Eg. I am a licensed doctor with 10 years of experience in the field."
                value={formData.bio || ""}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>
        </section>

        {/* Consultation Settings */}
        <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100 mb-8">
          <h2 className="text-xl font-medium text-gray-800 mb-6">Consultation Settings</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Consultation Modes</label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked
                  className="h-4 w-4 text-blue-600 border-gray-300"
                  onChange={() => {}}
                />
                <span className="ml-2 text-sm text-gray-700">Report Review</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability / Working Hours
              </label>
              <div className="space-y-2">
                {[
                  ["Monday - Friday", "9:00 AM - 5:00 PM"],
                  ["Saturday", "10:00 AM - 2:00 PM"],
                  ["Sunday", "Closed"],
                ].map(([day, time], i) => (
                  <div key={i} className="flex justify-between text-sm text-gray-700">
                    <span>{day}</span>
                    <span>{time}</span>
                  </div>
                ))}
                <button 
                  type="button"
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  <FaEdit className="inline mr-1" />
                  Edit Schedule
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <button 
            type="button"
            className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => window.location.reload()}
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </main>
  );
};

export default ProfileSection;