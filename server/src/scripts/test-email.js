/**
 * Script to test email configuration
 * Usage: node src/scripts/test-email.js [recipient_email]
 */
require('dotenv').config();
const emailService = require('../services/email.service');
const { logger } = require('../utils');

async function testEmail() {
  try {
    const recipient = process.argv[2] || 'your-test-email@example.com';
    
    logger.info(`Sending test email to ${recipient}...`);
    
    // Generate a test OTP for verification email
    const testOTP = Math.floor(100000 + Math.random() * 900000).toString();
    
    await emailService.sendVerificationEmail(
      recipient,
      'Test User',
      testOTP
    );
    
    logger.info('Test email sent successfully!');
    logger.info(`Test OTP: ${testOTP}`);
    process.exit(0);
  } catch (error) {
    logger.error('Error sending test email:', error);
    process.exit(1);
  }
}

testEmail();