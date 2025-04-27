const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const fs = require('fs');
const { errorHandler } = require('./middleware/error.middleware');
const { UPLOADS_DIR, MEDICAL_FILES_DIR, DOCTOR_FILES_DIR } = require('./utils/constants');

// Load environment variables
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure upload directories exist
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

if (!fs.existsSync(MEDICAL_FILES_DIR)) {
  fs.mkdirSync(MEDICAL_FILES_DIR, { recursive: true });
}

if (!fs.existsSync(DOCTOR_FILES_DIR)) {
  fs.mkdirSync(DOCTOR_FILES_DIR, { recursive: true });
}

// Serve static files from uploads directory with proper MIME types
app.use('/uploads', express.static(UPLOADS_DIR, {
  setHeaders: (res, path) => {
    // Set appropriate content type for different file types
    if (path.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
    } else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (path.endsWith('.dcm')) {
      res.setHeader('Content-Type', 'application/dicom');
    }
    
    // Set cache control for better performance
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
  }
}));

// Import routes
const authRoutes = require('./routes/auth.routes');
const patientRoutes = require('./routes/patient.routes');
const doctorRoutes = require('./routes/doctor.routes');
const adminRoutes = require('./routes/admin.routes');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;