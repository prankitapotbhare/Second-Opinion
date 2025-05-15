const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();
const logger = require('./utils/logger.util');

// Add this near the top with other imports
const appointmentStatusUpdater = require('./jobs/appointment-status-updater');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

let statusUpdaterInterval = null;

mongoose.connect(MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
    
    // Start the server
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      
      // Initialize the appointment status updater after server is running
      statusUpdaterInterval = appointmentStatusUpdater.initAppointmentStatusUpdater();
    });
    
    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        
        // Clear the interval if it exists
        if (statusUpdaterInterval) {
          clearInterval(statusUpdaterInterval);
          logger.info('Appointment status updater stopped');
        }
        
        // Close database connection
        mongoose.connection.close(false, () => {
          logger.info('MongoDB connection closed');
          process.exit(0);
        });
      });
    });
  })
  .catch(err => {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  });