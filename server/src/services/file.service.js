/**
 * File handling service
 */
const fs = require('fs');
const path = require('path');
const { createError } = require('../utils/error.util');
const cloudinaryService = require('./cloudinary.service');

/**
 * Delete file from Cloudinary
 * @param {string} fileUrl - Cloudinary URL
 * @returns {boolean} True if file was deleted, false if it didn't exist
 */
exports.deleteFileIfExists = async (fileUrl) => {
  try {
    if (!fileUrl) return false;
    
    const publicId = cloudinaryService.getPublicIdFromUrl(fileUrl);
    if (!publicId) return false;
    
    const result = await cloudinaryService.deleteFile(publicId);
    return result.result === 'ok';
  } catch (error) {
    throw createError(`Failed to delete file: ${error.message}`, 500);
  }
};

/**
 * Delete multiple files from Cloudinary
 * @param {Array} files - Array of file objects with path property
 * @returns {number} Number of files deleted
 */
exports.deleteFiles = async (files) => {
  if (!files || !Array.isArray(files) || files.length === 0) {
    return 0;
  }
  
  let deletedCount = 0;
  
  for (const file of files) {
    try {
      if (file && file.path) {
        const publicId = cloudinaryService.getPublicIdFromUrl(file.path);
        if (publicId) {
          const result = await cloudinaryService.deleteFile(publicId);
          if (result.result === 'ok') {
            deletedCount++;
          }
        }
      }
    } catch (error) {
      console.error(`Error deleting file ${file.path}: ${error.message}`);
      // Continue with other files even if one fails
    }
  }
  
  return deletedCount;
};

/**
 * Get content type based on file extension
 * @param {string} filePath - File path
 * @returns {string} Content type
 */
exports.getContentType = (filePath) => {
  const extension = path.extname(filePath).toLowerCase();
  
  const contentTypes = {
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.dcm': 'application/dicom',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.csv': 'text/csv',
    '.txt': 'text/plain'
  };
  
  return contentTypes[extension] || 'application/octet-stream';
};

/**
 * Stream file to response from Cloudinary URL
 * @param {Object} res - Express response object
 * @param {string} fileUrl - Cloudinary URL
 * @param {string} fileName - Original file name
 * @param {boolean} asAttachment - Whether to serve as attachment or inline
 */
exports.streamFileToResponse = (res, fileUrl, fileName, asAttachment = false) => {
  if (!fileUrl) {
    throw createError('File URL not provided', 400);
  }
  
  // Determine content type
  const contentType = this.getContentType(fileName);
  
  // Set headers
  res.setHeader('Content-Type', contentType);
  const disposition = asAttachment ? 'attachment' : 'inline';
  res.setHeader('Content-Disposition', `${disposition}; filename="${encodeURIComponent(fileName)}"`);
  
  // Redirect to Cloudinary URL
  res.redirect(fileUrl);
};

/**
 * Process doctor documents
 * @param {Object} files - Uploaded files
 * @returns {Object} Processed document objects
 */
exports.processDocuments = (files) => {
  const documents = {};
  
  if (!files) {
    return documents;
  }
  
  // Handle registration certificate
  if (files.registrationCertificate && files.registrationCertificate.length > 0) {
    const file = files.registrationCertificate[0];
    documents.registrationCertificate = {
      fileName: file.originalname,
      filePath: file.urlPath, // Cloudinary URL
      fileType: file.mimetype,
      fileSize: file.size,
      cloudinaryId: file.cloudinaryId, // Store Cloudinary ID
      uploadDate: new Date()
    };
  }
  
  // Handle government ID
  if (files.governmentId && files.governmentId.length > 0) {
    const file = files.governmentId[0];
    documents.governmentId = {
      fileName: file.originalname,
      filePath: file.urlPath, // Cloudinary URL
      fileType: file.mimetype,
      fileSize: file.size,
      cloudinaryId: file.cloudinaryId, // Store Cloudinary ID
      uploadDate: new Date()
    };
  }
  
  // Handle profile photo
  if (files.profilePhoto && files.profilePhoto.length > 0) {
    const file = files.profilePhoto[0];
    documents.profilePhoto = file.urlPath; // Cloudinary URL
  }
  
  return documents;
};

/**
 * Process uploaded medical files
 * @param {Array} files - Uploaded files
 * @returns {Array} Processed file objects
 */
exports.processUploadedFiles = (files) => {
  const medicalFiles = [];
  
  if (!files || !Array.isArray(files) || files.length === 0) {
    return medicalFiles;
  }
  
  files.forEach(file => {
    medicalFiles.push({
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      uploadDate: new Date(),
      filePath: file.urlPath, // Cloudinary URL
      cloudinaryId: file.cloudinaryId // Store Cloudinary ID
    });
  });
  
  return medicalFiles;
};

// Remove unused local file system functions
// Keep getUrlPath for backward compatibility but modify it
/**
 * Converts a file system path to a URL path for client access
 * @param {string} filePath - The full file system path or Cloudinary URL
 * @returns {string} URL path for client access
 */
exports.getUrlPath = function(filePath) {
  // If it's already a URL (Cloudinary), return it
  if (filePath && (filePath.startsWith('http://') || filePath.startsWith('https://'))) {
    return filePath;
  }
  
  // For backward compatibility, construct a URL from local path
  // This should not be used in new code
  const BASE_URL = process.env.SERVER_URL || 'http://localhost:5000';
  
  // Extract the part of the path after 'uploads'
  const uploadsDirIndex = filePath.indexOf('uploads');
  if (uploadsDirIndex === -1) return filePath;
  
  // Get the relative path from the uploads directory
  const relativePath = filePath.substring(uploadsDirIndex);
  
  // Convert backslashes to forward slashes for URL compatibility
  return `${BASE_URL}/${relativePath.replace(/\\/g, '/')}`;
};