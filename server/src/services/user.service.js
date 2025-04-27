/**
 * Common user operations service
 */
const { createError } = require('../utils/error.util');

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