const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const patientController = require('../controllers/patient.controller');
const doctorController = require('../controllers/doctor.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');

// Apply authentication to all admin routes
router.use(authenticate);
router.use(checkRole(['admin']));

// Admin profile routes
router.get('/profile/:id', adminController.getAdminDetails);
router.put('/profile/:id', adminController.updateAdmin);

// User management routes
router.get('/patients', adminController.getAllPatients);
router.get('/patients/:id', patientController.getPatientDetails);
router.post('/patients', patientController.createPatient);
router.put('/patients/:id', patientController.updatePatient);

router.get('/doctors', adminController.getAllDoctors);
router.get('/doctors/:id', doctorController.getDoctorDetails);
router.post('/doctors', doctorController.createDoctor);
router.put('/doctors/:id', doctorController.updateDoctor);

// Admin management
router.post('/create', adminController.createAdmin);

// Patient form access
router.get('/patients/:id/forms', patientController.getFormSubmissions);
router.get('/patients/:id/forms/:formId', patientController.getFormSubmission);
router.put('/patients/:id/forms/:formId', patientController.updateFormSubmission);
router.get('/patients/:id/forms/:formId/files/:fileId', patientController.downloadMedicalFile);
router.delete('/patients/:id/forms/:formId/files/:fileId', patientController.deleteMedicalFile);

module.exports = router;