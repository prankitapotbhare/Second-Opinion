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

// User management routes - Patients
router.get('/patients', adminController.getAllPatients);
router.get('/patients/:id', patientController.getPatientDetails);
router.post('/patients', patientController.createPatient);
router.put('/patients/:id', patientController.updatePatient);
router.delete('/patients/:id', adminController.deletePatient);

// User management routes - Doctors
router.get('/doctors', adminController.getAllDoctors);
router.get('/doctors/:id', doctorController.getDoctorDetails);
router.post('/doctors', doctorController.createDoctor);
router.put('/doctors/:id', doctorController.updateDoctor);
router.delete('/doctors/:id', adminController.deleteDoctor);

// Admin management
router.get('/admins', adminController.getAllAdmins);
router.post('/admins', adminController.createAdmin);
router.delete('/admins/:id', adminController.deleteAdmin);

// Patient form access for administration
router.get('/patients/:id/forms', patientController.getFormSubmissions);
router.get('/patients/:id/forms/:formId', patientController.getFormSubmission);
router.put('/patients/:id/forms/:formId', patientController.updateFormSubmission);
router.get('/patients/:id/forms/:formId/files/:fileId', patientController.downloadMedicalFile);
router.delete('/patients/:id/forms/:formId/files/:fileId', patientController.deleteMedicalFile);

// Doctor document verification for administration
router.get('/doctors/:id/documents/:documentType', doctorController.downloadDocument);
router.get('/doctors/:id/availability', doctorController.getAvailability);

module.exports = router;