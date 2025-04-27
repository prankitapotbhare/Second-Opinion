const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');
const multer = require('multer');
const { DOCTOR_FILES_DIR, ALLOWED_DOCUMENT_TYPES, FILE_SIZE_LIMITS } = require('../utils/constants');
const path = require('path');
const fs = require('fs');
const fileService = require('../services/file.service');

// Ensure doctor files directory exists
fileService.ensureDirectoryExists(DOCTOR_FILES_DIR);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create doctor-specific directory using authenticated user ID
    const doctorDir = path.join(DOCTOR_FILES_DIR, req.user.id);
    fileService.ensureDirectoryExists(doctorDir);
    cb(null, doctorDir);
  },
  filename: function (req, file, cb) {
    // Add a timestamp and sanitize the filename
    const sanitizedName = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
    const uniqueName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(sanitizedName)}`;
    cb(null, uniqueName);
  }
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  if (ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type. Allowed types: ${ALLOWED_DOCUMENT_TYPES.join(', ')}`), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: FILE_SIZE_LIMITS.DOCTOR_DOCUMENT
  },
  fileFilter: fileFilter
});

// Apply authentication to all doctor routes
router.use(authenticate);
router.use(checkRole(['doctor']));

// Doctor profile routes (using authenticated user)
router.get('/profile', doctorController.getDoctorProfile);
router.put('/profile', doctorController.updateDoctorProfile);

// Updated profile completion route (using authenticated user)
router.post('/profile/complete', 
  upload.fields([
    { name: 'registrationCertificate', maxCount: 1 },
    { name: 'governmentId', maxCount: 1 },
    { name: 'profilePhoto', maxCount: 1 }
  ]),
  doctorController.completeProfile
);

// Separate document upload routes (using authenticated user)
router.post('/profile/documents', 
  upload.fields([
    { name: 'registrationCertificate', maxCount: 1 },
    { name: 'governmentId', maxCount: 1 }
  ]),
  doctorController.uploadDocuments
);
router.get('/profile/documents/:documentType', doctorController.downloadDocument);

// Availability management (using authenticated user)
router.post('/profile/availability', doctorController.setAvailability);
router.get('/profile/availability', doctorController.getDoctorAvailability);

module.exports = router;