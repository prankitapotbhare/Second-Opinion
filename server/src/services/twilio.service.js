const twilio = require('twilio');
const logger = require('../utils/logger.util');

// Environment variables
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client if credentials are available
let twilioClient = null;
if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  logger.info('Twilio client initialized successfully');
} else {
  logger.warn('Twilio credentials not found. SMS functionality will be disabled.');
}

/**
 * Send SMS using Twilio
 * @param {string} to - Recipient phone number (with country code)
 * @param {string} message - SMS message content
 * @returns {Promise} Twilio response or null if disabled
 */
const sendSMS = async (to, message) => {
  try {
    // Skip if Twilio is not configured
    if (!twilioClient) {
      logger.info(`[MOCK SMS] To: ${to}, Message: ${message}`);
      return null;
    }

    // Format phone number correctly for India
    // Remove any spaces, dashes, or parentheses
    to = to.replace(/[\s\-()]/g, '');
    
    // Ensure it has the country code
    if (!to.startsWith('+')) {
      // If it starts with 0, replace with +91
      if (to.startsWith('0')) {
        to = '+91' + to.substring(1);
      } 
      // If it starts with 91, add +
      else if (to.startsWith('91')) {
        to = '+' + to;
      }
      // Otherwise assume it's an Indian number without country code
      else {
        to = '+91' + to;
      }
    }

    logger.info(`Attempting to send SMS to: ${to}`);

    // Send SMS via Twilio - using the exact format from the example
    return twilioClient.messages
      .create({
        body: message,
        from: TWILIO_PHONE_NUMBER,
        to: to
      })
      .then(message => {
        logger.info(`SMS sent successfully, SID: ${message.sid}`);
        return message;
      })
      .catch(error => {
        logger.error(`Twilio API error: ${error.message}`, error);
        // Log more details about the error
        if (error.code) {
          logger.error(`Twilio error code: ${error.code}`);
        }
        return null;
      });
  } catch (error) {
    logger.error('Error sending SMS:', error);
    return null;
  }
};

/**
 * Format and send notification for patient details status change
 * @param {Object} patientDetails - The patient details document
 * @param {string} oldStatus - Previous status
 * @param {string} newStatus - New status
 * @param {Object} patient - Patient document
 * @param {Object} doctor - Doctor document
 */
const sendStatusChangeNotification = async (patientDetails, oldStatus, newStatus, patient, doctor) => {
  try {
    logger.info(`Status change notification: ${oldStatus} -> ${newStatus}`);
    
    // Skip if Twilio is not configured
    if (!twilioClient) {
      logger.info(`[MOCK STATUS NOTIFICATION] From: ${oldStatus} To: ${newStatus}`);
      return;
    }

    // Get phone numbers with detailed logging
    let patientPhone = patient?.phone || patientDetails.phone || patientDetails.contactNumber;
    let doctorPhone = doctor?.phone;
    
    logger.info(`Raw patient phone: ${patientPhone}, Raw doctor phone: ${doctorPhone}`);
    
    // Ensure phone numbers have the correct format
    if (patientPhone && !patientPhone.startsWith('+')) {
      patientPhone = '+' + (patientPhone.startsWith('91') ? patientPhone : '91' + patientPhone);
    }
    
    if (doctorPhone && !doctorPhone.startsWith('+')) {
      doctorPhone = '+' + (doctorPhone.startsWith('91') ? doctorPhone : '91' + doctorPhone);
    }
    
    logger.info(`Formatted patient phone: ${patientPhone}, Formatted doctor phone: ${doctorPhone}`);

    if (!patientPhone && !doctorPhone) {
      logger.warn('No phone numbers available for SMS notification');
      return;
    }

    // Define messages based on status transition
    let patientMessage = '';
    let doctorMessage = '';

    // Use the fullName from patientDetails and name from doctor
    const patientName = patientDetails.fullName || 'Patient';
    const doctorName = doctor?.name || 'Doctor';
    
    logger.info(`Using patient name: ${patientName}, doctor name: ${doctorName}`);

    switch (newStatus) {
      case 'opinion-needed':
        patientMessage = `Hello ${patientName}, Dr. ${doctorName} has reviewed your case and determined that a second opinion is needed. Please log in to schedule an appointment.`;
        break;
      
      case 'opinion-not-needed':
        patientMessage = `Hello ${patientName}, Dr. ${doctorName} has reviewed your case and determined that a second opinion is not needed at this time. Please check your account for details.`;
        break;
      
      case 'under-review':
        doctorMessage = `Hello Dr. ${doctorName}, patient ${patientName} has requested an appointment for a second opinion. Please review and respond to this request.`;
        break;
      
      case 'approved':
        const appointmentDate = patientDetails.appointmentDetails?.date 
          ? new Date(patientDetails.appointmentDetails.date).toLocaleDateString() 
          : 'scheduled date';
        const appointmentTime = patientDetails.appointmentDetails?.time || 'scheduled time';
        
        patientMessage = `Hello ${patientName}, your appointment with Dr. ${doctorName} has been approved for ${appointmentDate} at ${appointmentTime}. Please log in for details.`;
        break;
      
      case 'rejected':
        patientMessage = `Hello ${patientName}, unfortunately your appointment request with Dr. ${doctorName} could not be accommodated. Please log in to check alternative options.`;
        break;
      
      case 'completed':
        patientMessage = `Hello ${patientName}, your appointment with Dr. ${doctorName} has been marked as completed. Thank you for using our service.`;
        break;
      
      default:
        logger.info(`No notification defined for status change to ${newStatus}`);
        return;
    }

    // Send messages if defined
    if (patientMessage && patientPhone) {
      logger.info(`Sending SMS to patient: ${patientPhone}`);
      try {
        const result = await sendSMS(patientPhone, patientMessage);
        logger.info(`Patient SMS result: ${result ? 'Success' : 'Failed'}`);
      } catch (error) {
        logger.error(`Error sending patient SMS: ${error.message}`);
      }
    }
    
    if (doctorMessage && doctorPhone) {
      logger.info(`Sending SMS to doctor: ${doctorPhone}`);
      try {
        const result = await sendSMS(doctorPhone, doctorMessage);
        logger.info(`Doctor SMS result: ${result ? 'Success' : 'Failed'}`);
      } catch (error) {
        logger.error(`Error sending doctor SMS: ${error.message}`);
      }
    }
    
    logger.info('Status change notification completed successfully');
  } catch (error) {
    logger.error('Error sending status change notification:', error);
    logger.error('Error details:', error.stack);
  }
};

module.exports = {
  sendSMS,
  sendStatusChangeNotification
};