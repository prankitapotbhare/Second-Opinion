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
  'image/png'
];

module.exports = {
  UPLOADS_DIR,
  MEDICAL_FILES_DIR,
  DOCTOR_FILES_DIR,
  ALLOWED_FILE_TYPES,
  ALLOWED_DOCUMENT_TYPES
};