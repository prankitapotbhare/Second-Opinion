const mongoose = require('mongoose');
const PatientDetails = require('../models/patientDetails.model');
const logger = require('../utils/logger.util');
const cron = require('node-cron');

/**
 * Convert time string (HH:MM) to minutes since midnight
 * @param {string} timeStr - Time in HH:MM format
 * @returns {number} Minutes since midnight
 */
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Update appointment statuses based on business rules
 */
const updateAppointmentStatuses = async () => {
  try {
    logger.info('Starting appointment status update process');
    
    // Get current date
    const now = new Date();
    
    // Fix: Define currentMinutes variable
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    
    // Find and update appointments as needed
    const appointmentsToUpdate = await PatientDetails.find({
      status: 'approved',
      $or: [
        // Past dates
        { 'appointmentDetails.date': { $lt: new Date(now.setHours(0, 0, 0, 0)) } },
        // Today with time passed
        {
          'appointmentDetails.date': {
            $gte: new Date(now.setHours(0, 0, 0, 0)),
            $lt: new Date(now.setHours(23, 59, 59, 999))
          },
          'appointmentDetails.time': { $exists: true }
        }
      ]
    });

    let updatedCount = 0;

    for (const appointment of appointmentsToUpdate) {
      // For today's appointments, check if time has passed
      if (appointment.appointmentDetails.date.toDateString() === now.toDateString()) {
        const appointmentMinutes = timeToMinutes(appointment.appointmentDetails.time);
        // Add 30 minutes buffer after appointment time
        if (currentMinutes < appointmentMinutes + 30) {
          continue; // Skip if appointment time + buffer hasn't passed yet
        }
      }

      // Update status to completed
      appointment.status = 'completed';
      appointment.appointmentDetails.isCompleted = true;
      appointment.appointmentDetails.completedAt = new Date();
      await appointment.save();
      updatedCount++;
    }

    if (updatedCount > 0) {
      logger.info(`Auto-updated ${updatedCount} appointments to 'completed' status`);
    }
    
    // Example of how you might be using currentMinutes:
    // const currentTimeInMinutes = (currentHours * 60) + currentMinutes;
    
    logger.info('Appointment status update completed');
  } catch (error) {
    logger.error('Error updating appointment statuses:', error);
  }
};

/**
 * Initialize the appointment status updater
 */
const initAppointmentStatusUpdater = () => {
  try {
    logger.info('Initializing appointment status updater');
    
    // Use setInterval instead of node-cron for more reliability
    // Run every hour (3600000 ms)
    const intervalId = setInterval(async () => {
      try {
        logger.info('Running scheduled appointment status update job');
        await updateAppointmentStatuses();
        logger.info('Scheduled appointment status update job completed');
      } catch (error) {
        logger.error('Error in scheduled appointment status update job:', error);
      }
    }, 3600000); // Every hour
    
    // Also run once at startup after a short delay
    setTimeout(async () => {
      try {
        logger.info('Running initial appointment status update job');
        await updateAppointmentStatuses();
        logger.info('Initial appointment status update job completed');
      } catch (error) {
        logger.error('Error in initial appointment status update job:', error);
      }
    }, 10000); // Wait 10 seconds after server start
    
    logger.info('Appointment status updater initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize appointment status updater:', error);
  }
};

module.exports = {
  updateAppointmentStatuses,
  initAppointmentStatusUpdater
};