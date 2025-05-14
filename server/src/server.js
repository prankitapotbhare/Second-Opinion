const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Add this near the top with other imports
const appointmentStatusUpdater = require('./jobs/appointment-status-updater');

// Add this after your server is initialized, before or after the server.listen() call
appointmentStatusUpdater.initAppointmentStatusUpdater();