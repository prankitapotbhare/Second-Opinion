const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');
const { patientFileUpload, handleUploadError, processFilePaths } = require('../middleware/upload.middleware');

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

// --- PUBLIC: Get doctor reviews ---
router.get(
  '/doctors/:doctorId/reviews',
  patientController.getDoctorReviewsPublic
);

// Apply authentication to all patient routes
router.use(authenticate);
router.use(checkRole(['patient']));

// Patient details routes
router.post('/patient-details', 
  patientFileUpload.array('medicalFiles', 5),
  handleUploadError,
  processFilePaths, // Add this middleware
  patientController.createPatientDetails
);

// Check appointment status
router.get('/response', patientController.getResponse);

// Get available slots for a doctor on a specific date
router.get('/doctors/:doctorId/available-slots', patientController.getAvailableSlots);

// Request appointment
router.post('/response/:responseId/appointment', patientController.requestAppointment);

// Add review route
router.post(
  '/response/:submissionId/review',
  patientController.submitReview
);

module.exports = router;