const path = require('path');

// Define upload paths
const UPLOADS_DIR = path.join(__dirname, '../uploads');
const MEDICAL_FILES_DIR = path.join(UPLOADS_DIR, 'medical_files');

// Define allowed file types
const ALLOWED_FILE_TYPES = [
  'application/pdf', 
  'image/jpeg', 
  'image/png', 
  'image/dicom', 
  'application/dicom'
];

module.exports = {
  UPLOADS_DIR,
  MEDICAL_FILES_DIR,
  ALLOWED_FILE_TYPES
};