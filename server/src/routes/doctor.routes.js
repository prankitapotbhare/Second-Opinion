const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const patientController = require('../controllers/patient.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');

// Apply authentication to all doctor routes
router.use(authenticate);
router.use(checkRole(['doctor']));

// Doctor profile routes
router.get('/profile/:id', doctorController.getDoctorDetails);
router.put('/profile/:id', doctorController.updateDoctor);
router.post('/profile/:id/complete', doctorController.completeProfile);
router.post('/profile/:id/documents', doctorController.uploadDocuments);
router.get('/profile/:id/documents/:documentType', doctorController.downloadDocument);
router.post('/profile/:id/availability', doctorController.setAvailability);
router.get('/profile/:id/availability', doctorController.getAvailability);

// Patient data access routes (doctors need to see patient data they're consulting for)
router.get('/patients/:id', patientController.getPatientDetails);
router.get('/patients/:id/forms', patientController.getFormSubmissions);
router.get('/patients/:id/forms/:formId', patientController.getFormSubmission);
router.put('/patients/:id/forms/:formId', patientController.updateFormSubmission);
router.get('/patients/:id/forms/:formId/files/:fileId', patientController.downloadMedicalFile);

module.exports = router;