const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const fs = require('fs');
const { errorHandler } = require('./middleware/error.middleware');
const { UPLOADS_DIR, MEDICAL_FILES_DIR } = require('./utils/constants');

// Load environment variables
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure main uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

if (!fs.existsSync(MEDICAL_FILES_DIR)) {
  fs.mkdirSync(MEDICAL_FILES_DIR, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(UPLOADS_DIR));

// Import routes
const authRoutes = require('./routes/auth.routes');
const patientRoutes = require('./routes/patient.routes');
const doctorRoutes = require('./routes/doctor.routes');
const adminRoutes = require('./routes/admin.routes');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/admins', adminRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;