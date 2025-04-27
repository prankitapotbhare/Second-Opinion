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

// Patient data access routes (doctors need to see patient data)
router.get('/patients/:id', patientController.getPatientDetails);
router.get('/patients/:id/forms', patientController.getFormSubmissions);
router.get('/patients/:id/forms/:formId', patientController.getFormSubmission);
router.put('/patients/:id/forms/:formId', patientController.updateFormSubmission);
router.get('/patients/:id/forms/:formId/files/:fileId', patientController.downloadMedicalFile);

module.exports = router;