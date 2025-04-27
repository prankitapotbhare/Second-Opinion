const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');
const doctorController = require('../controllers/doctor.controller'); // Add this import
const { authenticate } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');
const multer = require('multer');
const { MEDICAL_FILES_DIR, ALLOWED_FILE_TYPES } = require('../utils/constants');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, MEDICAL_FILES_DIR);
  },
  filename: function (req, file, cb) {
    // Add a timestamp and sanitize the filename
    const sanitizedName = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
    cb(null, `${Date.now()}-${sanitizedName}`);
  }
});

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
router.use(checkRole(['patient']));

// Patient profile routes
router.get('/profile/:id', patientController.getPatientDetails);
router.put('/profile/:id', patientController.updatePatient);

// Form submission routes
router.post('/:id/forms', patientController.submitForm);
router.get('/:id/forms', patientController.getFormSubmissions);
router.get('/:id/forms/:formId', patientController.getFormSubmission);
router.put('/:id/forms/:formId', patientController.updateFormSubmission);

// File handling routes for form submissions
router.post('/:id/forms/:formId/files', 
  upload.single('file'), 
  patientController.uploadMedicalFile
);
router.get('/:id/forms/:formId/files/:fileId', 
  patientController.downloadMedicalFile
);
router.delete('/:id/forms/:formId/files/:fileId', 
  patientController.deleteMedicalFile
);

// Get all doctors (patients need to see available doctors)
// Use doctorController instead of patientController
router.get('/doctors', doctorController.getAllDoctors);

module.exports = router;