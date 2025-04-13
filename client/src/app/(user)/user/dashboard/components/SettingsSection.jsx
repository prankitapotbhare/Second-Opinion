import React, { useState } from "react";
import { FaLock, FaBell, FaShieldAlt, FaLanguage, FaDesktop } from "react-icons/fa";

const SettingsSection = () => {
  const [activeTab, setActiveTab] = useState("account");
  
  // Mock settings data
  const [accountSettings, setAccountSettings] = useState({
    email: "john.doe@example.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    appointmentReminders: true,
    marketingEmails: false,
    smsNotifications: true
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    dataSharing: true,
    anonymousReviews: false
  });
  
  const [preferences, setPreferences] = useState({
    language: "english",
    theme: "light",
    fontSize: "medium"
  });
  
  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handlePrivacyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPrivacySettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  
  const handlePreferencesChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Password validation and update logic would go here
    alert("Password updated successfully!");
    setAccountSettings(prev => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }));
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">Settings</h1>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {/* Settings Tabs */}
          <div className="sm:w-64 bg-gray-50 p-4 sm:p-6 border-b sm:border-b-0 sm:border-r border-gray-200">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("account")}
                className={`flex items-center px-3 py-2 w-full text-left rounded-md ${
                  activeTab === "account"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaLock className="mr-3" />
                <span>Account Security</span>
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex items-center px-3 py-2 w-full text-left rounded-md ${
                  activeTab === "notifications"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaBell className="mr-3" />
                <span>Notifications</span>
              </button>
              <button
                onClick={() => setActiveTab("privacy")}
                className={`flex items-center px-3 py-2 w-full text-left rounded-md ${
                  activeTab === "privacy"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaShieldAlt className="mr-3" />
                <span>Privacy</span>
              </button>
              <button
                onClick={() => setActiveTab("preferences")}
                className={`flex items-center px-3 py-2 w-full text-left rounded-md ${
                  activeTab === "preferences"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FaDesktop className="mr-3" />
                <span>Preferences</span>
              </button>
            </nav>
          </div>
          
          {/* Settings Content */}
          <div className="flex-1 p-4 sm:p-6">
            {/* Account Security */}
            {activeTab === "account" && (
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">Account Security</h2>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={accountSettings.email}
                    onChange={handleAccountChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    To change your email, please contact support.
                  </p>
                </div>
                
                <h3 className="text-md font-medium text-gray-800 mb-3">Change Password</h3>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={accountSettings.currentPassword}
                        onChange={handleAccountChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={accountSettings.newPassword}
                        onChange={handleAccountChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={accountSettings.confirmPassword}
                        onChange={handleAccountChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Notifications */}
            {activeTab === "notifications" && (
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">Notification Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive emails about your account activity</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={notificationSettings.emailNotifications}
                        onChange={handleNotificationChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Appointment Reminders</h3>
                      <p className="text-sm text-gray-500">Receive reminders about upcoming appointments</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="appointmentReminders"
                        checked={notificationSettings.appointmentReminders}
                        onChange={handleNotificationChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Marketing Emails</h3>
                      <p className="text-sm text-gray-500">Receive emails about new services and offers</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="marketingEmails"
                        checked={notificationSettings.marketingEmails}
                        onChange={handleNotificationChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">SMS Notifications</h3>
                      <p className="text-sm text-gray-500">Receive text messages for important updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="smsNotifications"
                        checked={notificationSettings.smsNotifications}
                        onChange={handleNotificationChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={() => alert("Notification settings saved!")}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
            
            {/* Privacy */}
            {activeTab === "privacy" && (
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">Privacy Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Visibility
                    </label>
                    <select
                      name="profileVisibility"
                      value={privacySettings.profileVisibility}
                      onChange={handlePrivacyChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="public">Public - Visible to everyone</option>
                      <option value="private">Private - Visible only to your doctors</option>
                      <option value="hidden">Hidden - Visible only to you</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Data Sharing for Research</h3>
                      <p className="text-sm text-gray-500">Allow anonymous data to be used for medical research</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="dataSharing"
                        checked={privacySettings.dataSharing}
                        onChange={handlePrivacyChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Anonymous Reviews</h3>
                      <p className="text-sm text-gray-500">Post doctor reviews anonymously</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="anonymousReviews"
                        checked={privacySettings.anonymousReviews}
                        onChange={handlePrivacyChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={() => alert("Privacy settings saved!")}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
            
            {/* Preferences */}
            {activeTab === "preferences" && (
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-4">Preferences</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      name="language"
                      value={preferences.language}
                      onChange={handlePreferencesChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                      <option value="chinese">Chinese</option>
                      <option value="hindi">Hindi</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Theme
                    </label>
                    <select
                      name="theme"
                      value={preferences.theme}
                      onChange={handlePreferencesChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Font Size
                    </label>
                    <select
                      name="fontSize"
                      value={preferences.fontSize}
                      onChange={handlePreferencesChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={() => alert("Preferences saved!")}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default SettingsSection;