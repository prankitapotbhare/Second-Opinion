import React from "react";
import { FaPhoneAlt, FaEnvelope, FaLock, FaTrash, FaUserCircle } from "react-icons/fa";

const SettingSection = ({ user }) => {
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h1>

      {/* Privacy & Security */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 mb-8">
        <h2 className="text-xl font-medium text-gray-800 mb-6 flex items-center">
          <FaLock className="mr-2 text-indigo-600" />
          Privacy & Security
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Change Password
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 text-gray-600 placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter current password"
                />
              </div>
              <div></div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 text-gray-600 placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 text-gray-600 placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* Account Management */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 mb-8">
        <h2 className="text-xl font-medium text-gray-800 mb-6 flex items-center">
          <FaUserCircle className="mr-2 text-indigo-600" />
          Account Management
        </h2>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h3 className="text-lg font-medium text-red-600 mb-1">
                Delete Account
              </h3>
              <p className="text-sm text-gray-500 max-w-md">
                Once you delete your account, there is no going back. Please be certain.
              </p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center">
              <FaTrash className="mr-2" />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
        <h2 className="text-xl font-medium text-gray-800 mb-6 flex items-center">
          <FaEnvelope className="mr-2 text-indigo-600" />
          Contact Information
        </h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex">
                <div className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                  <FaEnvelope className="text-gray-500" />
                </div>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={user?.email || "doctor@example.com"}
                  readOnly
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex">
                <div className="flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                  <FaPhoneAlt className="text-gray-500" />
                </div>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Update Contact Info
          </button>
        </div>
      </div>
    </main>
  );
};

export default SettingSection;