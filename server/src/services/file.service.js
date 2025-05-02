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
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (error) {
    throw createError(`Failed to create directory: ${error.message}`, 500);
  }
};

/**
 * Delete file if exists
 * @param {string} filePath - File path
 * @returns {boolean} True if file was deleted, false if it didn't exist
 */
exports.deleteFileIfExists = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    throw createError(`Failed to delete file: ${error.message}`, 500);
  }
};

/**
 * Delete multiple files
 * @param {Array} files - Array of file objects with path property
 * @returns {number} Number of files deleted
 */
exports.deleteFiles = (files) => {
  if (!files || !Array.isArray(files) || files.length === 0) {
    return 0;
  }
  
  let deletedCount = 0;
  
  files.forEach(file => {
    try {
      if (file && file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
        deletedCount++;
      }
    } catch (error) {
      console.error(`Error deleting file ${file.path}: ${error.message}`);
      // Continue with other files even if one fails
    }
  });
  
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
 * Stream file to response
 * @param {Object} res - Express response object
 * @param {string} filePath - File path
 * @param {string} fileName - Original file name
 * @param {boolean} asAttachment - Whether to serve as attachment or inline
 */
exports.streamFileToResponse = (res, filePath, fileName, asAttachment = false) => {
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    throw createError('File not found on server', 404);
  }
  
  // Determine content type
  const contentType = this.getContentType(filePath);
  
  // Set headers
  res.setHeader('Content-Type', contentType);
  const disposition = asAttachment ? 'attachment' : 'inline';
  res.setHeader('Content-Disposition', `${disposition}; filename="${encodeURIComponent(fileName)}"`);
  
  // Stream the file
  const fileStream = fs.createReadStream(filePath);
  fileStream.on('error', (error) => {
    console.error(`Error streaming file: ${error.message}`);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Error streaming file'
      });
    }
  });
  
  fileStream.pipe(res);
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
      filePath: file.urlPath || this.getUrlPath(file.path), // Use URL path instead of file system path
      fileType: file.mimetype,
      fileSize: file.size,
      uploadDate: new Date()
    };
  }
  
  // Handle government ID
  if (files.governmentId && files.governmentId.length > 0) {
    const file = files.governmentId[0];
    documents.governmentId = {
      fileName: file.originalname,
      filePath: file.urlPath || this.getUrlPath(file.path), // Use URL path instead of file system path
      fileType: file.mimetype,
      fileSize: file.size,
      uploadDate: new Date()
    };
  }
  
  // Handle profile photo
  if (files.profilePhoto && files.profilePhoto.length > 0) {
    const file = files.profilePhoto[0];
    documents.profilePhoto = file.urlPath || this.getUrlPath(file.path); // Use URL path instead of file system path
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
      filePath: file.urlPath || this.getUrlPath(file.path) // Use URL path instead of file system path
    });
  });
  
  return medicalFiles;
};

/**
 * Get file stats
 * @param {string} filePath - File path
 * @returns {Object} File stats
 */
exports.getFileStats = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const stats = fs.statSync(filePath);
    return {
      size: stats.size,
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime,
      isDirectory: stats.isDirectory(),
      isFile: stats.isFile()
    };
  } catch (error) {
    throw createError(`Failed to get file stats: ${error.message}`, 500);
  }
};

/**
 * Copy file
 * @param {string} sourcePath - Source file path
 * @param {string} destinationPath - Destination file path
 * @returns {boolean} True if successful
 */
exports.copyFile = (sourcePath, destinationPath) => {
  try {
    if (!fs.existsSync(sourcePath)) {
      throw createError('Source file does not exist', 404);
    }
    
    // Ensure destination directory exists
    const destinationDir = path.dirname(destinationPath);
    this.ensureDirectoryExists(destinationDir);
    
    fs.copyFileSync(sourcePath, destinationPath);
    return true;
  } catch (error) {
    throw createError(`Failed to copy file: ${error.message}`, 500);
  }
};

/**
 * Move file
 * @param {string} sourcePath - Source file path
 * @param {string} destinationPath - Destination file path
 * @returns {boolean} True if successful
 */
exports.moveFile = (sourcePath, destinationPath) => {
  try {
    if (!fs.existsSync(sourcePath)) {
      throw createError('Source file does not exist', 404);
    }
    
    // Ensure destination directory exists
    const destinationDir = path.dirname(destinationPath);
    this.ensureDirectoryExists(destinationDir);
    
    fs.renameSync(sourcePath, destinationPath);
    return true;
  } catch (error) {
    throw createError(`Failed to move file: ${error.message}`, 500);
  }
};

/**
 * Read file contents
 * @param {string} filePath - File path
 * @param {string} encoding - File encoding (default: utf8)
 * @returns {string} File contents
 */
exports.readFileContents = (filePath, encoding = 'utf8') => {
  try {
    if (!fs.existsSync(filePath)) {
      throw createError('File does not exist', 404);
    }
    
    return fs.readFileSync(filePath, { encoding });
  } catch (error) {
    throw createError(`Failed to read file: ${error.message}`, 500);
  }
};

/**
 * Converts a file system path to a URL path for client access
 * @param {string} filePath - The full file system path
 * @returns {string} URL path for client access
 */
exports.getUrlPath = function(filePath) {
  // Get the base URL from environment variables or use default
  const BASE_URL = process.env.SERVER_URL || 'http://localhost:5000';
  
  // Extract the part of the path after 'uploads'
  const uploadsDirIndex = filePath.indexOf('uploads');
  if (uploadsDirIndex === -1) return filePath;
  
  // Get the relative path from the uploads directory
  const relativePath = filePath.substring(uploadsDirIndex);
  
  // Convert backslashes to forward slashes for URL compatibility
  return `${BASE_URL}/${relativePath.replace(/\\/g, '/')}`;
};