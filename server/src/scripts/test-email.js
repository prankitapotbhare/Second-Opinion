/**
 * Script to test email configuration
 * Usage: node src/scripts/test-email.js [recipient_email]
 */
require('dotenv').config();
const emailService = require('../services/email.service');

async function testEmail() {
  try {
    const recipient = process.argv[2] || 'your-test-email@example.com';
    
    console.log(`Sending test email to ${recipient}...`);
    
    await emailService.sendVerificationEmail(
      recipient,
      'Test User',
      'test-verification-token'
    );
    
    console.log('Test email sent successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error sending test email:', error);
    process.exit(1);
  }
}

testEmail();