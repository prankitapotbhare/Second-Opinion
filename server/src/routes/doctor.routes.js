const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const patientController = require('../controllers/patient.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');
const multer = require('multer');
const { DOCTOR_FILES_DIR, ALLOWED_DOCUMENT_TYPES, FILE_SIZE_LIMITS } = require('../utils/constants');
const path = require('path');
const fs = require('fs');

// Ensure doctor files directory exists
if (!fs.existsSync(DOCTOR_FILES_DIR)) {
  fs.mkdirSync(DOCTOR_FILES_DIR, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create doctor-specific directory using authenticated user ID
    const doctorDir = path.join(DOCTOR_FILES_DIR, req.user.id);
    if (!fs.existsSync(doctorDir)) {
      fs.mkdirSync(doctorDir, { recursive: true });
    }
    cb(null, doctorDir);
  },
  filename: function (req, file, cb) {
    // Add a timestamp and sanitize the filename
    const sanitizedName = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
    const uniqueName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(sanitizedName)}`;
    cb(null, uniqueName);
  }
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  if (ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type. Allowed types: ${ALLOWED_DOCUMENT_TYPES.join(', ')}`), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: FILE_SIZE_LIMITS.DOCTOR_DOCUMENT
  },
  fileFilter: fileFilter
});

// Apply authentication to all doctor routes
router.use(authenticate);
router.use(checkRole(['doctor']));

// Doctor profile routes (using authenticated user)
router.get('/profile', doctorController.getDoctorProfile);
router.put('/profile', doctorController.updateDoctorProfile);

// Updated profile completion route (using authenticated user)
router.post('/profile/complete', 
  upload.fields([
    { name: 'registrationCertificate', maxCount: 1 },
    { name: 'governmentId', maxCount: 1 },
    { name: 'profilePhoto', maxCount: 1 }
  ]),
  doctorController.completeProfile
);

// Separate document upload routes (using authenticated user)
router.post('/profile/documents', 
  upload.fields([
    { name: 'registrationCertificate', maxCount: 1 },
    { name: 'governmentId', maxCount: 1 }
  ]),
  doctorController.uploadDocuments
);
router.get('/profile/documents/:documentType', doctorController.downloadDocument);

// Availability management (using authenticated user)
router.post('/profile/availability', doctorController.setAvailability);
router.get('/profile/availability', doctorController.getDoctorAvailability);

// Patient data access routes (doctors need to see patient data they're consulting for)
router.get('/patients/:id', patientController.getPatientDetails);
router.get('/patients/:id/forms', patientController.getFormSubmissions);
router.get('/patients/:id/forms/:formId', patientController.getFormSubmission);
router.put('/patients/:id/forms/:formId', patientController.updateFormSubmission);
router.get('/patients/:id/forms/:formId/files/:fileId', patientController.downloadMedicalFile);

module.exports = router;