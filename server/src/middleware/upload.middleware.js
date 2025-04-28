/**
 * File upload middleware configurations
 */
const multer = require('multer');
const path = require('path');
const { 
  MEDICAL_FILES_DIR, 
  DOCTOR_FILES_DIR, 
  ALLOWED_FILE_TYPES, 
  ALLOWED_DOCUMENT_TYPES, 
  FILE_SIZE_LIMITS 
} = require('../utils/constants');
const fileService = require('../services/file.service');

/**
 * Configure storage for patient medical files
 */
const patientStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create patient-specific directory using authenticated user ID
    const patientDir = path.join(MEDICAL_FILES_DIR, req.user.id);
    fileService.ensureDirectoryExists(patientDir);
    cb(null, patientDir);
  },
  filename: function (req, file, cb) {
    // Add a timestamp and sanitize the filename
    const sanitizedName = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${sanitizedName}`;
    cb(null, uniqueName);
  }
});

/**
 * Configure storage for doctor documents
 */
// For doctor document uploads
const doctorStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Convert ObjectId to string before using it in path.join
    const doctorId = req.user.id.toString();
    const doctorDir = path.join(DOCTOR_FILES_DIR, doctorId);
    fileService.ensureDirectoryExists(doctorDir);
    cb(null, doctorDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

/**
 * File filter for medical files
 */
const medicalFileFilter = (req, file, cb) => {
  if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`), false);
  }
};

/**
 * File filter for doctor documents
 */
const doctorDocumentFilter = (req, file, cb) => {
  if (ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type. Allowed types: ${ALLOWED_DOCUMENT_TYPES.join(', ')}`), false);
  }
};

/**
 * Multer configuration for patient medical files
 */
exports.patientFileUpload = multer({
  storage: patientStorage,
  limits: {
    fileSize: FILE_SIZE_LIMITS.MEDICAL_FILE
  },
  fileFilter: medicalFileFilter
});

/**
 * Multer configuration for doctor documents
 */
exports.doctorFileUpload = multer({
  storage: doctorStorage,
  limits: {
    fileSize: FILE_SIZE_LIMITS.DOCTOR_DOCUMENT
  },
  fileFilter: doctorDocumentFilter
});

/**
 * Handle multer errors
 */
exports.handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`
    });
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next();
};