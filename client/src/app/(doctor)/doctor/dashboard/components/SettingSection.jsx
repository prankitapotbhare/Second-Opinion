import React, { useState } from "react";
import { useDoctor } from "@/contexts/DoctorContext";
import { FaPhoneAlt, FaEnvelope, FaLock, FaTrash, FaUserCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const SettingSection = ({ user }) => {
  const { doctor, loading, deleteAccount, changePassword } = useDoctor();
  const { logout } = useAuth();
  const router = useRouter();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility({
      ...passwordVisibility,
      [field]: !passwordVisibility[field]
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    // Clear any previous messages when user starts typing
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    // Validate passwords
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordSuccess("Password updated successfully");
      // Clear form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      setPasswordError(error.message || "Failed to update password");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      // Logout and redirect to home page after successful deletion
      logout();
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6">

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
            {passwordError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                {passwordSuccess}
              </div>
            )}
            <form onSubmit={handleUpdatePassword}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwordVisibility.currentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 text-gray-600 placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter current password"
                    />
                    <button 
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      onClick={() => togglePasswordVisibility('currentPassword')}
                    >
                      {passwordVisibility.currentPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <div></div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwordVisibility.newPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 text-gray-600 placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter new password"
                    />
                    <button 
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      onClick={() => togglePasswordVisibility('newPassword')}
                    >
                      {passwordVisibility.newPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwordVisibility.confirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 text-gray-600 placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Confirm new password"
                    />
                    <button 
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                    >
                      {passwordVisibility.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>
              <button 
                type="submit"
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
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
                Permanently delete your account and all associated data.
              </p>
            </div>
            <button 
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
              onClick={() => setShowDeleteModal(true)}
              disabled={loading}
            >
              <FaTrash className="mr-2" />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Help & Support */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
        <h2 className="text-xl font-medium text-gray-800 mb-6 flex items-center">
          <FaEnvelope className="mr-2 text-indigo-600" />
          Help & Support
        </h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                <FaPhoneAlt className="text-blue-500" />
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-800">Support Phone</h3>
                <p className="text-sm text-gray-500">+91-XXXXXXXXXX</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                <FaEnvelope className="text-blue-500" />
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-800">Support Email</h3>
                <p className="text-sm text-blue-500">support@healthplatform.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-sm border border-gray-200">
            <h3 className="text-center text-xl font-semibold text-gray-800 mb-2">
              Confirm Account Deletion
            </h3>
            
            <p className="text-center text-gray-600 mb-8">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </p>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  handleDeleteAccount();
                }}
                className="px-6 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all font-medium"
                disabled={loading}
              >
                {loading ? "Processing..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default SettingSection;