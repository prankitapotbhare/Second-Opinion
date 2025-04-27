const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');
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