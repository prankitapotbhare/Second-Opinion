require('dotenv').config();
const twilioService = require('../services/twilio.service');
const logger = require('../utils/logger.util');

async function testTwilioSMS() {
  try {
    console.log('Testing Twilio SMS service...');
    
    // Replace with a valid phone number for testing
    const testPhoneNumber = '+919309431756';
    const testMessage = 'This is a test message from Second Opinion app';
    
    console.log(`Sending test SMS to ${testPhoneNumber}`);
    const result = await twilioService.sendSMS(testPhoneNumber, testMessage);
    
    if (result) {
      console.log('SMS sent successfully!');
      console.log('Message SID:', result.sid);
    } else {
      console.log('Failed to send SMS or mock SMS was logged');
    }
  } catch (error) {
    console.error('Error testing Twilio:', error);
  } finally {
    process.exit(0);
  }
}

testTwilioSMS();