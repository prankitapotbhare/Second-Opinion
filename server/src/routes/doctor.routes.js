const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');
const { doctorFileUpload, handleUploadError, uploadToCloudinary } = require('../middleware/upload.middleware');

// Apply authentication to all doctor routes
router.use(authenticate);
router.use(checkRole(['doctor']));

// Updated profile completion route (using authenticated user)
router.post('/profile/complete', 
  doctorFileUpload.fields([
    { name: 'registrationCertificate', maxCount: 1 },
    { name: 'governmentId', maxCount: 1 },
    { name: 'profilePhoto', maxCount: 1 }
  ]),
  handleUploadError,
  uploadToCloudinary, // Add this middleware
  doctorController.completeProfile
);

// Doctor profile routes (using authenticated user)
router.get('/profile', doctorController.getDoctorProfile);
router.put('/profile', 
  doctorFileUpload.fields([
    { name: 'registrationCertificate', maxCount: 1 },
    { name: 'governmentId', maxCount: 1 },
    { name: 'profilePhoto', maxCount: 1 }
  ]),
  handleUploadError,
  uploadToCloudinary, // Add this middleware
  doctorController.updateDoctorProfile
);

// Availability management (using authenticated user)
router.post('/profile/availability', doctorController.setAvailability);
router.get('/profile/availability', doctorController.getDoctorAvailability);

// Change password route (must be authenticated doctor)
router.post('/change-password', doctorController.changePassword);

// Delete account route
router.delete('/account', doctorController.deleteAccount);

// Dashboard routes
router.get('/stats', doctorController.getDashboardStats);
router.get('/reviews', doctorController.getDoctorReviews);

// Appointment management routes
router.get('/appointments', doctorController.getAppointments);
router.get('/appointments/:appointmentId', doctorController.getAppointmentDetails);
router.post('/appointments/:appointmentId/response', 
  doctorFileUpload.single('responseFile'),
  handleUploadError,
  uploadToCloudinary, // Add this middleware
  doctorController.submitAppointmentResponse
);

// Patient request management routes
router.get('/requests', doctorController.getPatientRequests);
router.put('/requests/:requestId/accept', doctorController.acceptPatientRequest);
router.put('/requests/:requestId/reject', doctorController.rejectPatientRequest);

module.exports = router;