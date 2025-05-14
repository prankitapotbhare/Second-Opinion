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

// New routes for doctor details and invoices
router.get('/doctors/:doctorId/patients-excel', adminController.getDoctorPatientsExcel);
router.get('/doctors/:doctorId/invoice', adminController.getDoctorInvoicePdf);
router.post('/doctors/:doctorId/send-invoice', adminController.sendDoctorInvoiceEmail);

module.exports = router;