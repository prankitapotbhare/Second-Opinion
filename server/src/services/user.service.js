/**
 * Common user operations service
 */
const { createError } = require('../utils/error.util');
const mongoose = require('mongoose');

/**
 * Get user profile by ID
 * @param {Model} Model - Mongoose model (Patient, Doctor, Admin)
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User document
 */
exports.getUserProfile = async (Model, userId) => {
  const user = await Model.findById(userId).select('-password');
  if (!user) {
    throw createError('User not found', 404);
  }
  return user;
};

/**
 * Update user profile
 * @param {Model} Model - Mongoose model (Patient, Doctor, Admin)
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated user document
 */
exports.updateUserProfile = async (Model, userId, updateData) => {
  // Don't allow password updates through this function
  if (updateData.password) {
    delete updateData.password;
  }
  
  // Don't allow role changes through this function
  if (updateData.role) {
    delete updateData.role;
  }
  
  const user = await Model.findByIdAndUpdate(
    userId,
    updateData,
    { new: true, runValidators: true }
  ).select('-password');
  
  if (!user) {
    throw createError('User not found', 404);
  }
  
  return user;
};

/**
 * Get user details by ID (for admin or authorized users)
 * @param {Model} Model - Mongoose model (Patient, Doctor, Admin)
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User document
 */
exports.getUserDetails = async (Model, userId) => {
  const user = await Model.findById(userId).select('-password');
  if (!user) {
    throw createError('User not found', 404);
  }
  return user;
};

/**
 * Create new user
 * @param {Model} Model - Mongoose model (Patient, Doctor, Admin)
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user document
 */
exports.createUser = async (Model, userData) => {
  const user = new Model(userData);
  await user.save();
  
  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;
  
  return userResponse;
};

/**
 * Update user by ID (admin function)
 * @param {Model} Model - Mongoose model (Patient, Doctor, Admin)
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated user document
 */
exports.updateUser = async (Model, userId, updateData) => {
  // Don't allow password updates through this function
  if (updateData.password) {
    delete updateData.password;
  }
  
  const user = await Model.findByIdAndUpdate(
    userId,
    updateData,
    { new: true, runValidators: true }
  ).select('-password');
  
  if (!user) {
    throw createError('User not found', 404);
  }
  
  return user;
};

/**
 * Get all users with pagination
 * @param {Model} Model - Mongoose model (Patient, Doctor, Admin)
 * @param {Object} filter - Filter criteria
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {string} sort - Sort criteria
 * @returns {Promise<Object>} Paginated users
 */
exports.getAllUsers = async (Model, filter = {}, page = 1, limit = 10, sort = '-createdAt') => {
  const skip = (page - 1) * limit;
  
  const users = await Model.find(filter)
    .select('-password')
    .sort(sort)
    .skip(skip)
    .limit(limit);
  
  const total = await Model.countDocuments(filter);
  
  return {
    users,
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages: Math.ceil(total / limit)
  };
};

/**
 * Delete user by ID
 * @param {Model} Model - Mongoose model (Patient, Doctor, Admin)
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} Success status
 */
exports.deleteUser = async (Model, userId) => {
  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw createError('Invalid user ID', 400);
  }
  
  const user = await Model.findByIdAndDelete(userId);
  
  if (!user) {
    throw createError('User not found', 404);
  }
  
  return true;
};

/**
 * Check if user exists by email
 * @param {Model} Model - Mongoose model (Patient, Doctor, Admin)
 * @param {string} email - User email
 * @returns {Promise<boolean>} True if user exists
 */
exports.userExistsByEmail = async (Model, email) => {
  const user = await Model.findOne({ email });
  return !!user;
};

/**
 * Get user by email
 * @param {Model} Model - Mongoose model (Patient, Doctor, Admin)
 * @param {string} email - User email
 * @returns {Promise<Object>} User document
 */
exports.getUserByEmail = async (Model, email) => {
  const user = await Model.findOne({ email });
  if (!user) {
    throw createError('User not found', 404);
  }
  return user;
};