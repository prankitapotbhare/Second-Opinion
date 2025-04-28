const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');
const { patientFileUpload, handleUploadError } = require('../middleware/upload.middleware');

// Apply authentication to all patient routes
router.use(authenticate);
router.use(checkRole(['patient']));

// Patient profile routes (using authenticated user)
router.get('/profile', patientController.getPatientProfile);
router.put('/profile', patientController.updatePatientProfile);

// Form submission routes (using authenticated user)
router.post('/forms', 
  patientFileUpload.array('medicalFiles', 5), // Allow up to 5 files in a single submission
  handleUploadError,
  patientController.submitForm
);
router.get('/forms', patientController.getFormSubmissions);
router.get('/forms/:formId', patientController.getFormSubmission);
router.put('/forms/:formId', patientController.updateFormSubmission);

// Additional file handling routes for form submissions
router.post('/forms/:formId/files', 
  patientFileUpload.array('files', 5), // Allow up to 5 files in a single upload
  handleUploadError,
  patientController.uploadMedicalFiles
);
router.get('/forms/:formId/files/:fileId', 
  patientController.downloadMedicalFile
);
router.delete('/forms/:formId/files/:fileId', 
  patientController.deleteMedicalFile
);

module.exports = router;