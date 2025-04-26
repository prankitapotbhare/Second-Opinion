const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Get the uploads directory path - use the same path as in app.js
const uploadsDir = path.join(__dirname, '../../uploads/medical_files');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Add a timestamp and sanitize the filename
    const sanitizedName = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
    cb(null, `${Date.now()}-${sanitizedName}`);
  }
});

// Define allowed file types
const ALLOWED_FILE_TYPES = [
  'application/pdf', 
  'image/jpeg', 
  'image/png', 
  'image/dicom', 
  'application/dicom'
];

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Please upload PDF, JPEG, PNG, or DICOM files.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

// Apply authentication to all patient routes
router.use(authenticate);

// Patient profile routes
router.get('/:id', checkRole(['patient', 'doctor', 'admin']), patientController.getPatientDetails);
router.post('/', checkRole(['admin']), patientController.createPatient);
router.put('/:id', checkRole(['patient', 'admin']), patientController.updatePatient);

// Form submission routes
router.post('/:id/forms', checkRole(['patient']), patientController.submitForm);
router.get('/:id/forms', checkRole(['patient', 'doctor', 'admin']), patientController.getFormSubmissions);
router.get('/:id/forms/:formId', checkRole(['patient', 'doctor', 'admin']), patientController.getFormSubmission);
router.put('/:id/forms/:formId', checkRole(['patient', 'doctor', 'admin']), patientController.updateFormSubmission);

// File handling routes for form submissions
router.post('/:id/forms/:formId/files', 
  checkRole(['patient']), 
  upload.single('file'), 
  patientController.uploadMedicalFile
);
router.get('/:id/forms/:formId/files/:fileId', 
  checkRole(['patient', 'doctor', 'admin']), 
  patientController.downloadMedicalFile
);
router.delete('/:id/forms/:formId/files/:fileId', 
  checkRole(['patient', 'admin']), 
  patientController.deleteMedicalFile
);

module.exports = router;