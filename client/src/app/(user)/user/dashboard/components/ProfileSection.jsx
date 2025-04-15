import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaIdCard } from "react-icons/fa";

const ProfileSection = ({ user }) => {
  // Mock user data - will be replaced with actual user data when available
  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, Anytown, CA 12345",
    dateOfBirth: "1985-06-15",
    gender: "Male",
    bloodType: "O+",
    emergencyContact: "Jane Doe",
    emergencyPhone: "+1 (555) 987-6543",
    allergies: "Penicillin",
    medicalConditions: "None"
  });

  // Update userData if user prop changes
  useEffect(() => {
    if (user) {
      setUserData(prevData => ({
        ...prevData,
        firstName: user.displayName ? user.displayName.split(' ')[0] : prevData.firstName,
        lastName: user.displayName ? user.displayName.split(' ').slice(1).join(' ') : prevData.lastName,
        email: user.email || prevData.email,
        // Add other fields from user object as needed
      }));
    }
  }, [user]);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userData);

  // Update formData when userData changes
  useEffect(() => {
    setFormData(userData);
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData(formData);
    setIsEditing(false);
    // Here you would typically save the data to your backend
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">My Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-md ${
            isEditing
              ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Rest of the component remains the same */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Type
                </label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Unknown</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Phone
                </label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allergies
                </label>
                <input
                  type="text"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="List any allergies or type 'None'"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Conditions
                </label>
                <input
                  type="text"
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="List any medical conditions or type 'None'"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mr-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                <p className="mt-1 text-base text-gray-900 flex items-center">
                  <FaUser className="text-blue-500 mr-2" />
                  {userData.firstName} {userData.lastName}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                <p className="mt-1 text-base text-gray-900 flex items-center">
                  <FaEnvelope className="text-blue-500 mr-2" />
                  {userData.email}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                <p className="mt-1 text-base text-gray-900 flex items-center">
                  <FaPhone className="text-blue-500 mr-2" />
                  {userData.phone}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                <p className="mt-1 text-base text-gray-900 flex items-center">
                  <FaMapMarkerAlt className="text-blue-500 mr-2" />
                  {userData.address}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                <p className="mt-1 text-base text-gray-900 flex items-center">
                  <FaCalendarAlt className="text-blue-500 mr-2" />
                  {userData.dateOfBirth}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                <p className="mt-1 text-base text-gray-900 flex items-center">
                  <FaUser className="text-blue-500 mr-2" />
                  {userData.gender}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Blood Type</h3>
                <p className="mt-1 text-base text-gray-900 flex items-center">
                  <FaIdCard className="text-blue-500 mr-2" />
                  {userData.bloodType}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Emergency Contact</h3>
                <p className="mt-1 text-base text-gray-900">
                  {userData.emergencyContact} ({userData.emergencyPhone})
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Medical Information */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Medical Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Allergies</h3>
            <p className="mt-1 text-base text-gray-900">{userData.allergies}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Medical Conditions</h3>
            <p className="mt-1 text-base text-gray-900">{userData.medicalConditions}</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfileSection;