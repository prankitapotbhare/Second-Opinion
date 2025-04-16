const User = require('../models/user.model');

/**
 * Get user profile by ID
 * @param {string} userId - User ID
 * @returns {Object} User data
 */
const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Object} Updated user data
 */
const updateUserProfile = async (userId, updateData) => {
  const { name, photoURL } = updateData;
  
  // Find user and update
  const user = await User.findByIdAndUpdate(
    userId,
    { name, photoURL, updatedAt: Date.now() },
    { new: true, runValidators: true }
  ).select('-password');
  
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

/**
 * Get all users (admin only)
 * @returns {Array} Array of users
 */
const getAllUsers = async () => {
  return await User.find().select('-password');
};

/**
 * Get user by ID (admin only)
 * @param {string} userId - User ID
 * @returns {Object} User data
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

/**
 * Update user (admin only)
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Object} Updated user data
 */
const updateUser = async (userId, updateData) => {
  const { name, email, role, emailVerified, photoURL, specialization } = updateData;
  
  // Find user and update
  const user = await User.findByIdAndUpdate(
    userId,
    { name, email, role, emailVerified, photoURL, specialization, updatedAt: Date.now() },
    { new: true, runValidators: true }
  ).select('-password');
  
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

/**
 * Delete user (admin only)
 * @param {string} userId - User ID
 */
const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};