const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');

// Apply authentication to all admin routes
router.use(authenticate);
router.use(checkRole(['admin']));

// Admin profile routes (using authenticated user)
router.get('/profile', adminController.getAdminProfile);
router.put('/profile', adminController.updateAdminProfile);

// User management routes - Patients
router.get('/patients', adminController.getAllPatients);
router.delete('/patients/:id', adminController.deletePatient);

// User management routes - Doctors
router.get('/doctors', adminController.getAllDoctors);
router.delete('/doctors/:id', adminController.deleteDoctor);

// Admin management
router.get('/admins', adminController.getAllAdmins);
router.post('/admins', adminController.createAdmin);
router.delete('/admins/:id', adminController.deleteAdmin);

module.exports = router;