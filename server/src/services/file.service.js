/**
 * File handling service
 */
const fs = require('fs');
const path = require('path');
const { createError } = require('../utils/error.util');

/**
 * Ensure directory exists
 * @param {string} dirPath - Directory path
 */
exports.ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * Delete file if exists
 * @param {string} filePath - File path
 */
exports.deleteFileIfExists = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

/**
 * Delete multiple files
 * @param {Array} files - Array of file objects with path property
 */
exports.deleteFiles = (files) => {
  if (files && files.length > 0) {
    files.forEach(file => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });
  }
};

/**
 * Get content type based on file extension
 * @param {string} filePath - File path
 * @returns {string} Content type
 */
exports.getContentType = (filePath) => {
  let contentType = 'application/octet-stream';
  
  if (filePath.endsWith('.pdf')) {
    contentType = 'application/pdf';
  } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
    contentType = 'image/jpeg';
  } else if (filePath.endsWith('.png')) {
    contentType = 'image/png';
  } else if (filePath.endsWith('.dcm')) {
    contentType = 'application/dicom';
  }
  
  return contentType;
};

/**
 * Stream file to response
 * @param {Object} res - Express response object
 * @param {string} filePath - File path
 * @param {string} fileName - Original file name
 */
exports.streamFileToResponse = (res, filePath, fileName) => {
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    throw createError('File not found on server', 404);
  }
  
  // Determine content type
  const contentType = this.getContentType(filePath);
  
  // Set headers
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
  
  // Stream the file
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
};