const nodemailer = require('nodemailer');
const logger = require('../utils/logger.util');
const emailTemplates = require('../utils/email-templates.util');

// Environment variables
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = process.env.EMAIL_PORT || 587;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@secondopinion.com';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Create transporter
const createTransporter = async () => {
  // For development/testing, use ethereal.email if no credentials provided
  if (process.env.NODE_ENV !== 'production' && (!EMAIL_USER || !EMAIL_PASS)) {
    try {
      const testAccount = await nodemailer.createTestAccount();
      logger.info('Created test email account:', testAccount.user);
      logger.info('Test email password:', testAccount.pass);
      logger.info('View emails at: https://ethereal.email');
      
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch (error) {
      logger.error('Failed to create test account:', error);
      // Fall back to console logging for development
      return {
        sendMail: (mailOptions) => {
          logger.debug('Email would have been sent:', {
            to: mailOptions.to,
            subject: mailOptions.subject
          });
          return Promise.resolve({ messageId: 'test-message-id' });
        }
      };
    }
  }
  
  // For production with Gmail
  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465, // true for 465, false for other ports
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    // Add these options for Gmail
    tls: {
      rejectUnauthorized: false
    }
  });
};

/**
 * Send email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email HTML content
 * @returns {Promise} Nodemailer info
 */
const sendEmail = async (to, subject, html) => {
  const transporter = await createTransporter();
  
  const mailOptions = {
    from: `"Second Opinion" <${EMAIL_FROM}>`,
    to,
    subject,
    html
  };

  const info = await transporter.sendMail(mailOptions);
  
  // Log email URL for development
  if (process.env.NODE_ENV !== 'production' && (!EMAIL_USER || !EMAIL_PASS)) {
    logger.debug('Email Preview URL:', nodemailer.getTestMessageUrl(info));
  }
  
  return info;
};

/**
 * Send verification email
 * @param {string} to - Recipient email
 * @param {string} name - Recipient name
 * @param {string} token - Verification token
 * @returns {Promise} Nodemailer info
 */
const sendVerificationEmail = async (to, name, token) => {
  const { subject, html } = emailTemplates.verificationEmailTemplate(name, token);
  return await sendEmail(to, subject, html);
};

/**
 * Send password reset email
 * @param {string} to - Recipient email
 * @param {string} name - Recipient name
 * @param {string} token - Reset token
 * @returns {Promise} Nodemailer info
 */
const sendPasswordResetEmail = async (to, name, token) => {
  const { subject, html } = emailTemplates.passwordResetEmailTemplate(name, token);
  return await sendEmail(to, subject, html);
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail
};