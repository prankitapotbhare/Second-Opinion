import React from "react";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const SettingSection = () => {
    return(
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h1>

      {/* Privacy & Security */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 mb-8">
        <h2 className="text-xl font-medium text-gray-800 mb-6">
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
                  className="w-full px-4 py-2 border border-gray-300  text-gray-600 placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300  text-gray-600 placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300  text-gray-600 placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer whitespace-nowrap !rounded-button">
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* Account Management */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 mb-8">
  <h2 className="text-xl font-medium text-gray-800 mb-6">Account Management</h2>
  <div className="space-y-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
      <div>
        <h3 className="text-lg font-medium text-red-600 mb-1">
          Delete Account
        </h3>
        <p className="text-sm text-gray-500 max-w-md">
          Permanently remove your account and all associated data. This action
          cannot be undone.
        </p>
      </div>
      <div>
        <button className="w-full md:w-auto px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 cursor-pointer whitespace-nowrap">
          Delete Account
        </button>
      </div>
    </div>
  </div>
</div>
      {/* Help & Support */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-medium text-gray-800 mb-6">
          Help & Support
        </h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
              <FaPhoneAlt />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">
                Support Phone
              </h3>
              <p className="text-sm text-gray-600">+91-XXXXXXXXXX</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
              <FaEnvelope />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">
                Support Email
              </h3>
              <a
                href="mailto:support@healthplatform.com"
                className="text-sm text-blue-600 hover:underline"
              >
                support@healthplatform.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
    );
}

export default SettingSection;