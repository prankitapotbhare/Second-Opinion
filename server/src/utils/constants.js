const path = require('path');

// Define upload paths
const UPLOADS_DIR = path.join(__dirname, '../uploads');
const MEDICAL_FILES_DIR = path.join(UPLOADS_DIR, 'medical_files');
const DOCTOR_FILES_DIR = path.join(UPLOADS_DIR, 'doctor_files');

// Define allowed file types
const ALLOWED_FILE_TYPES = [
  'application/pdf', 
  'image/jpeg', 
  'image/png', 
  'image/dicom', 
  'application/dicom'
];

// Define allowed document types
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png'
];

// Define file size limits (in bytes)
const FILE_SIZE_LIMITS = {
  MEDICAL_FILE: 10 * 1024 * 1024, // 10MB for medical files
  DOCTOR_DOCUMENT: 5 * 1024 * 1024 // 5MB for doctor documents
};

// Define server URL for file access
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';

module.exports = {
  UPLOADS_DIR,
  MEDICAL_FILES_DIR,
  DOCTOR_FILES_DIR,
  ALLOWED_FILE_TYPES,
  ALLOWED_DOCUMENT_TYPES,
  FILE_SIZE_LIMITS,
  SERVER_URL
};