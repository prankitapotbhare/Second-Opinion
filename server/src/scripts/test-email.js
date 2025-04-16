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
    
    await emailService.sendVerificationEmail(
      recipient,
      'Test User',
      'test-verification-token'
    );
    
    logger.info('Test email sent successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Error sending test email:', error);
    process.exit(1);
  }
}

testEmail();