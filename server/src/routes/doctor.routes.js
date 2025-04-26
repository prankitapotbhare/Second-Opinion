const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');

// Apply authentication to all doctor routes
router.use(authenticate);

// Doctor routes
router.get('/', checkRole(['admin', 'patient']), doctorController.getAllDoctors);
router.get('/:id', checkRole(['doctor', 'admin']), doctorController.getDoctorDetails);
router.post('/', checkRole(['admin']), doctorController.createDoctor);
router.put('/:id', checkRole(['doctor', 'admin']), doctorController.updateDoctor);

module.exports = router;