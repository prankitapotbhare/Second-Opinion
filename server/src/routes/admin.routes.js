const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');

// Apply authentication to all admin routes
router.use(authenticate);
router.use(checkRole(['admin']));

// Admin routes
router.get('/:id', adminController.getAdminDetails);
router.put('/:id', adminController.updateAdmin);
router.get('/patients/all', adminController.getAllPatients);
router.get('/doctors/all', adminController.getAllDoctors);
router.post('/create', adminController.createAdmin);

module.exports = router;