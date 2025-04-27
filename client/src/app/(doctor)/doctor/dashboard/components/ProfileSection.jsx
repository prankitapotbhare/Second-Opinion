import React from 'react';
import {
  FaCamera,
  FaEnvelope,
  FaPhoneAlt,
  FaUpload,
  FaChevronDown,
  FaFilePdf,
  FaTrash,
  FaPlus,
  FaTimesCircle,
  FaEdit,
} from "react-icons/fa";

const ProfileSection = () => {
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">

      {/* Personal Information */}
      <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100 mb-8">
        <h2 className="text-xl font-medium text-gray-800 mb-6">Personal Information</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="col-span-1 lg:col-span-2 flex flex-col sm:flex-row items-start gap-6 mb-4">
            <div className="relative">
              <img
                src="https://public.readdy.ai/ai/img_res/fc4e928c7d3a4337c7173c0e07f786b5.jpg"
                alt="Doctor profile"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover object-top"
              />
              <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-md cursor-pointer">
                <FaCamera />
              </button>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-800">Dr. Jane Doe</h3>
              <p className="text-sm text-gray-500 mb-2">Cardiologist</p>
              <p className="text-sm text-gray-600 mb-1 flex items-center">
                <FaEnvelope className="mr-2 text-gray-400" />
                jane.doe@healthplatform.com
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <FaPhoneAlt className="mr-2 text-gray-400" />
                +1 (555) 123-4567
              </p>
            </div>
          </div>

          {/* Inputs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              value="Dr. Jane Doe"
              onChange={() => {}}
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
                    className="h-4 w-4 text-blue-600 border-gray-300"
                    defaultChecked={label === "Female"}
                    onChange={() => {}}
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              value="+1 (555) 123-4567"
              onChange={() => {}}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              value="jane.doe@healthplatform.com"
              onChange={() => {}}
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
              <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700 appearance-none">
                <option>Eg. Cardiology</option>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              placeholder="Eg. 5,8,10"
              onChange={() => {}}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Hospital/Clinic Affiliation </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              placeholder="Eg. Apollo Hospitals, Chennai"
              onChange={() => {}}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hospital Address</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              placeholder="Eg. AIIMS Delhi, India"
              onChange={() => {}}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Medical License Number </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              placeholder="Eg. 4455648"
              onChange={() => {}}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Medical Council </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              placeholder="Eg. Medical Council of India (MCI) / USMLE (USA)"
              onChange={() => {}}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              placeholder="Eg. 984XXXXXXX"
              onChange={() => {}}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Registration Certificate Upload </label>
            <div className="relative">
              <input
                type="file"
                id="certificate-upload"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={() => {}}
              />
              <label 
                htmlFor="certificate-upload" 
                className="flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700 cursor-pointer hover:bg-gray-50"
              >
                <span className="text-gray-500">Upload PDF/JPG</span>
                <FaUpload className="text-blue-500" />
              </label>
              <div className="mt-2 text-xs text-gray-500">
                Supported formats: PDF, JPG, JPEG, PNG (Max size: 100MB)
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone number </label>
            <input
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              placeholder="Eg. 984XXXXXXX"
              onChange={() => {}}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              placeholder="Eg. gurusharan@gmail.com"
              onChange={() => {}}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact number </label>
            <input
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              placeholder="Eg. 784XXXXXXX"
              onChange={() => {}}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Address</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              placeholder="Eg. Fortis Hospital, Bandra, Mumbai"
              onChange={() => {}}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location:</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              placeholder="Eg. Fortis Hospital, Bandra, Mumbai"
              onChange={() => {}}
            />
          </div>
          <div className="col-span-1 lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700 h-32"
              placeholder="Eg. I am a licensed doctor with 10 years of experience in the field."
              onChange={() => {}}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Languages Spoken</label>
            <div className="flex flex-wrap gap-2">
              {["English", "Spanish"].map((lang, i) => (
                <div
                  key={i}
                  className="flex items-center bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm"
                >
                  {lang}
                  <button className="ml-2 text-blue-600 hover:text-blue-800">
                    <FaTimesCircle />
                  </button>
                </div>
              ))}
              <button className="flex items-center px-3 py-1 border border-dashed border-gray-300 rounded-full text-sm text-gray-600 hover:bg-gray-100">
                <FaPlus className="mr-1" />
                Add
              </button>
            </div>
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
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                <FaEdit className="inline mr-1" />
                Edit Schedule
              </button>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Short Bio</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700 h-32"
              value="Dr. Jane Doe is a board-certified cardiologist with over 12 years of experience..."
              onChange={() => {}}
            ></textarea>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <button className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Cancel
        </button>
        <button className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </main>
  );
};

export default ProfileSection;
