const express = require('express');
const cors = require('cors');
const app = express();
const { errorHandler } = require('./middleware/error.middleware');
const { UPLOADS_DIR, MEDICAL_FILES_DIR, DOCTOR_FILES_DIR } = require('./utils/constants');
const fileService = require('./services/file.service');

// Load environment variables
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure upload directories exist
fileService.ensureDirectoryExists(UPLOADS_DIR);
fileService.ensureDirectoryExists(MEDICAL_FILES_DIR);
fileService.ensureDirectoryExists(DOCTOR_FILES_DIR);

// Serve static files from uploads directory with proper MIME types
app.use('/uploads', express.static(UPLOADS_DIR, {
  setHeaders: (res, path) => {
    // Set appropriate content type for different file types
    res.setHeader('Content-Type', fileService.getContentType(path));
    
    // Set cache control for better performance
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
    
    // Set CORS headers to allow access from client
    res.setHeader('Access-Control-Allow-Origin', '*');
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
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;