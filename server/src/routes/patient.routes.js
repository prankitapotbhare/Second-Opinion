const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');
const doctorController = require('../controllers/doctor.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');
const multer = require('multer');
const { MEDICAL_FILES_DIR, ALLOWED_FILE_TYPES, FILE_SIZE_LIMITS } = require('../utils/constants');
const path = require('path');
const fileService = require('../services/file.service');

// Ensure medical files directory exists
fileService.ensureDirectoryExists(MEDICAL_FILES_DIR);

// Configure multer for file uploads
const storage = multer.diskStorage({
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

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: FILE_SIZE_LIMITS.MEDICAL_FILE
  },
  fileFilter: fileFilter
});

// Apply authentication to all patient routes
router.use(authenticate);
router.use(checkRole(['patient']));

// Patient profile routes (using authenticated user)
router.get('/profile', patientController.getPatientProfile);
router.put('/profile', patientController.updatePatientProfile);

// Form submission routes (using authenticated user)
router.post('/forms', 
  upload.array('medicalFiles', 5), // Allow up to 5 files in a single submission
  patientController.submitForm
);
router.get('/forms', patientController.getFormSubmissions);
router.get('/forms/:formId', patientController.getFormSubmission);
router.put('/forms/:formId', patientController.updateFormSubmission);

// Additional file handling routes for form submissions
router.post('/forms/:formId/files', 
  upload.array('files', 5), // Allow up to 5 files in a single upload
  patientController.uploadMedicalFiles
);
router.get('/forms/:formId/files/:fileId', 
  patientController.downloadMedicalFile
);
router.delete('/forms/:formId/files/:fileId', 
  patientController.deleteMedicalFile
);

// Doctor listing and details (patients need to see available doctors)
router.get('/doctors', doctorController.getAllDoctors);
router.get('/doctors/:id', doctorController.getDoctorDetails);
router.get('/doctors/:id/availability', doctorController.getAvailability);

module.exports = router;