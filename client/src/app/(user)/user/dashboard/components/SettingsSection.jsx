import React from "react";
import { FaPhoneAlt, FaEnvelope, FaLock, FaTrash, FaUserCircle, FaBell, FaShieldAlt, FaGlobe } from "react-icons/fa";

const SettingsSection = ({ user }) => {
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6">

      {/* Account Settings */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 mb-8">
        <h2 className="text-xl font-medium text-gray-800 mb-6 flex items-center">
          <FaUserCircle className="mr-2 text-blue-600" />
          Account Settings
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Profile Information
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex">
                  <input
                    type="email"
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                    value={user?.email || "user@example.com"}
                    disabled
                  />
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700">
                    Change
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="flex">
                  <input
                    type="tel"
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                    value="+1 (555) 123-4567"
                    disabled
                  />
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700">
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm new password"
                />
              </div>
              <div className="flex items-end">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Update Password
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Two-Factor Authentication
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">
                  Add an extra layer of security to your account
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  We'll send a verification code to your phone each time you sign in
                </p>
              </div>
              <div className="flex items-center">
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 mb-8">
        <h2 className="text-xl font-medium text-gray-800 mb-6 flex items-center">
          <FaBell className="mr-2 text-yellow-600" />
          Notification Preferences
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <h3 className="font-medium text-gray-800">Appointment Reminders</h3>
              <p className="text-sm text-gray-500">Get notified about upcoming appointments</p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <h3 className="font-medium text-gray-800">Medical Updates</h3>
              <p className="text-sm text-gray-500">Receive updates about test results and prescriptions</p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <h3 className="font-medium text-gray-800">Email Notifications</h3>
              <p className="text-sm text-gray-500">Receive email updates about your account</p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <h3 className="font-medium text-gray-800">SMS Notifications</h3>
              <p className="text-sm text-gray-500">Receive text message updates</p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-red-100 mb-8">
        <h2 className="text-xl font-medium text-gray-800 mb-6 flex items-center">
          <FaTrash className="mr-2 text-red-600" />
          Danger Zone
        </h2>
        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h3 className="font-medium text-red-800 mb-2">Delete Account</h3>
            <p className="text-sm text-gray-600 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              Delete My Account
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SettingsSection;