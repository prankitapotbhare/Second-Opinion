const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');
const { patientFileUpload, handleUploadError } = require('../middleware/upload.middleware');

// --- PUBLIC: Get doctors with filters ---
router.get(
  '/doctors',
  patientController.getDoctorsPublic
);

// --- PUBLIC: Get doctor by ID ---
router.get(
  '/doctors/:doctorId',
  patientController.getDoctorByIdPublic
);

// Apply authentication to all patient routes
router.use(authenticate);
router.use(checkRole(['patient']));

// Form submission routes (using authenticated user)
router.post('/forms', 
  patientFileUpload.array('medicalFiles', 5), // Allow up to 5 files in a single submission
  handleUploadError,
  patientController.submitForm
);

router.get('/forms/:formId/files/:fileId', 
  patientController.downloadMedicalFile
);

module.exports = router;