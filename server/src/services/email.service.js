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
 * @param {Array} attachments - Optional email attachments
 * @returns {Promise} Nodemailer info
 */
const sendEmail = async (to, subject, html, attachments = []) => {
  const transporter = await createTransporter();
  
  const mailOptions = {
    from: `"Second Opinion" <${EMAIL_FROM}>`,
    to,
    subject,
    html
  };

  // Add attachments if provided
  if (attachments && attachments.length > 0) {
    mailOptions.attachments = attachments;
  }

  const info = await transporter.sendMail(mailOptions);
  
  // Log email URL for development
  if (process.env.NODE_ENV !== 'production' && (!EMAIL_USER || !EMAIL_PASS)) {
    logger.debug('Email Preview URL:', nodemailer.getTestMessageUrl(info));
  }
  
  return info;
};

/**
 * Send verification email with OTP
 * @param {string} to - Recipient email
 * @param {string} name - Recipient name
 * @param {string} otp - Verification OTP
 * @param {string} userType - Type of user (user, doctor)
 * @returns {Promise} Nodemailer info
 */
const sendVerificationEmail = async (to, name, otp, userType = 'patient') => {
  const { subject, html } = emailTemplates.verificationEmailTemplate(name, otp, userType);
  return await sendEmail(to, subject, html);
};

/**
 * Send password reset email
 * @param {string} to - Recipient email
 * @param {string} name - Recipient name
 * @param {string} token - Reset token
 * @param {string} userType - Type of user (user, doctor, admin)
 * @returns {Promise} Nodemailer info
 */
const sendPasswordResetEmail = async (to, name, token, userType = "patient") => {
  const { subject, html } = emailTemplates.passwordResetEmailTemplate(name, token, to, userType);
  return await sendEmail(to, subject, html);
};

/**
 * Send invoice email to doctor
 * @param {string} email - Doctor's email
 * @param {string} name - Doctor's name
 * @param {string} invoicePath - Path to the invoice file
 * @returns {Promise<Object>} Email sending result
 */
const sendInvoiceEmail = async (email, name, invoicePath) => {
  try {
    const subject = 'Your Invoice from Second Opinion';
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Invoice from Second Opinion</h2>
        <p>Hello Dr. ${name},</p>
        <p>Please find attached your invoice from Second Opinion.</p>
        <p>Thank you for your services.</p>
        <p>Best regards,<br>Second Opinion Team</p>
      </div>
    `;
    
    const attachments = [
      {
        filename: 'invoice.pdf',
        path: invoicePath
      }
    ];
    
    return await sendEmail(email, subject, htmlContent, attachments);
  } catch (error) {
    logger.error('Error sending invoice email:', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendInvoiceEmail
};
