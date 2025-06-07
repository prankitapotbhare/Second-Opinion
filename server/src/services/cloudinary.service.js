/**
 * Cloudinary service for file uploads and management
 */
const cloudinary = require('cloudinary').v2;
const { createError } = require('../utils/error.util');

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload a file to Cloudinary
 * @param {string} filePath - Local file path or buffer
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Cloudinary upload result
 */
exports.uploadFile = async (filePath, options = {}) => {
  try {
    // Set default folder based on file type if not specified
    if (!options.folder) {
      options.folder = 'second-opinion/uploads';
    }
    
    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, options);
    return result;
  } catch (error) {
    throw createError(`Failed to upload file to Cloudinary: ${error.message}`, 500);
  }
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - Cloudinary public ID of the file
 * @returns {Promise<Object>} Cloudinary deletion result
 */
exports.deleteFile = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw createError(`Failed to delete file from Cloudinary: ${error.message}`, 500);
  }
};

/**
 * Get a signed URL for a file
 * @param {string} publicId - Cloudinary public ID of the file
 * @param {Object} options - Transformation options
 * @returns {string} Signed URL
 */
exports.getSecureUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, {
    secure: true,
    ...options
  });
};

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string} Public ID
 */
exports.getPublicIdFromUrl = (url) => {
  if (!url) return null;
  
  try {
    // Extract the public ID from the URL
    // Format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.ext
    const urlParts = url.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    
    if (uploadIndex === -1) return null;
    
    // Get everything after 'upload' and the version number (v1234567890)
    const publicIdWithVersion = urlParts.slice(uploadIndex + 1).join('/');
    // Remove the version part if it exists
    const publicId = publicIdWithVersion.replace(/^v\d+\//, '');
    
    return publicId;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};