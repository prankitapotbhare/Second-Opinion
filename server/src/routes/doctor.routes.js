const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');
const { doctorFileUpload, handleUploadError } = require('../middleware/upload.middleware');

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
  doctorController.completeProfile
);

// Doctor profile routes (using authenticated user)
router.get('/profile', doctorController.getDoctorProfile);
router.put('/profile', doctorController.updateDoctorProfile);

// Separate document upload routes (using authenticated user)
router.post('/profile/documents', 
  doctorFileUpload.fields([
    { name: 'registrationCertificate', maxCount: 1 },
    { name: 'governmentId', maxCount: 1 }
  ]),
  handleUploadError,
  doctorController.uploadDocuments
);
router.get('/profile/documents/:documentType', doctorController.downloadDocument);

// Availability management (using authenticated user)
router.post('/profile/availability', doctorController.setAvailability);
router.get('/profile/availability', doctorController.getDoctorAvailability);

module.exports = router;