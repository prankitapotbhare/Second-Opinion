const mongoose = require('mongoose');
const PatientDetails = require('../models/patientDetails.model');
const logger = require('../utils/logger.util');
// Remove unused cron import
// const cron = require('node-cron');

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
    
    // Get current date - create only once
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = (currentHours * 60) + currentMinutes;
    
    // Create date objects for today's start and end - only once
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);
    
    // Use bulk operations for approved appointments
    const approvedBulkOps = [];
    
    // Find approved appointments that have passed
    const approvedAppointmentsToUpdate = await PatientDetails.find({
      status: 'approved',
      $or: [
        // Past dates
        { 'appointmentDetails.date': { $lt: todayStart } },
        // Today with time passed
        {
          'appointmentDetails.date': {
            $gte: todayStart,
            $lt: todayEnd
          },
          'appointmentDetails.time': { $exists: true }
        }
      ]
    }).lean(); // Use lean() for better performance

    let approvedUpdatedCount = 0;

    for (const appointment of approvedAppointmentsToUpdate) {
      // For today's appointments, check if time has passed
      if (appointment.appointmentDetails.date && 
          appointment.appointmentDetails.date.toDateString() === now.toDateString()) {
        const appointmentMinutes = timeToMinutes(appointment.appointmentDetails.time);
        // Add 30 minutes buffer after appointment time
        if (currentTimeInMinutes < appointmentMinutes + 30) {
          continue; // Skip if appointment time + buffer hasn't passed yet
        }
      }

      // Add to bulk operation instead of individual save
      approvedBulkOps.push({
        updateOne: {
          filter: { _id: appointment._id },
          update: {
            $set: {
              status: 'completed',
              'appointmentDetails.isCompleted': true,
              'appointmentDetails.completedAt': now
            }
          }
        }
      });
      approvedUpdatedCount++;
    }

    // Use bulk operations for under-review appointments
    const underReviewBulkOps = [];
    
    // Find under-review appointments that have passed
    const underReviewAppointmentsToUpdate = await PatientDetails.find({
      status: 'under-review',
      'appointmentDetails.date': { $lt: now }
    }).lean();

    let underReviewUpdatedCount = 0;

    for (const appointment of underReviewAppointmentsToUpdate) {
      // Add to bulk operation
      underReviewBulkOps.push({
        updateOne: {
          filter: { _id: appointment._id },
          update: {
            $set: { status: 'rejected' }
          }
        }
      });
      underReviewUpdatedCount++;
    }

    // Execute bulk operations if there are any
    if (approvedBulkOps.length > 0) {
      await PatientDetails.bulkWrite(approvedBulkOps);
      logger.info(`Auto-updated ${approvedUpdatedCount} appointments to 'completed' status`);
    }

    if (underReviewBulkOps.length > 0) {
      await PatientDetails.bulkWrite(underReviewBulkOps);
      logger.info(`Auto-updated ${underReviewUpdatedCount} appointments from 'under-review' to 'rejected' status`);
    }
    
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
    
    // Use a more robust scheduling approach
    let isJobRunning = false;
    
    // Run every hour (3600000 ms)
    const intervalId = setInterval(async () => {
      // Prevent overlapping job executions
      if (isJobRunning) {
        logger.warn('Previous job still running, skipping this execution');
        return;
      }
      
      try {
        isJobRunning = true;
        logger.info('Running scheduled appointment status update job');
        await updateAppointmentStatuses();
        logger.info('Scheduled appointment status update job completed');
      } catch (error) {
        logger.error('Error in scheduled appointment status update job:', error);
      } finally {
        isJobRunning = false;
      }
    }, 3600000); // Every hour
    
    // Also run once at startup after a short delay
    setTimeout(async () => {
      try {
        isJobRunning = true;
        logger.info('Running initial appointment status update job');
        await updateAppointmentStatuses();
        logger.info('Initial appointment status update job completed');
      } catch (error) {
        logger.error('Error in initial appointment status update job:', error);
      } finally {
        isJobRunning = false;
      }
    }, 10000); // Wait 10 seconds after server start
    
    logger.info('Appointment status updater initialized successfully');
    
    // Return the interval ID for potential cleanup
    return intervalId;
  } catch (error) {
    logger.error('Failed to initialize appointment status updater:', error);
    return null;
  }
};

module.exports = {
  updateAppointmentStatuses,
  initAppointmentStatusUpdater
};