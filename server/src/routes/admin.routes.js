const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');

// Apply authentication to all admin routes
router.use(authenticate);
router.use(checkRole(['admin']));

router.get('/stats', adminController.getStats);

// User management routes - Doctors
router.get('/doctors', adminController.getAllDoctors);

// User management routes - Patients
router.get('/patients', adminController.getAllPatients);

module.exports = router;