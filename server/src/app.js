const express = require('express');
const cors = require('cors');
const app = express();
const { errorHandler } = require('./middleware/error.middleware');
const { UPLOADS_DIR, MEDICAL_FILES_DIR, DOCTOR_FILES_DIR } = require('./utils/constants');
const fileService = require('./services/file.service');

// Load environment variables
require('dotenv').config();

// Allowed origins configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  // Add other domains as needed
  // 'https://yourdomain.com',
  // 'https://staging.yourdomain.com'
];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or server-to-server)
    if (!origin) return callback(null, true);
    
    // Use exact matching for security
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  // Add other security headers if needed
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Apply CORS middleware
app.use(cors(corsOptions));
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
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
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
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Handle 404 for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;