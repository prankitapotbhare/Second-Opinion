const nodemailer = require('nodemailer');

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
      console.log('Created test email account:', testAccount.user);
      console.log('Test email password:', testAccount.pass);
      console.log('View emails at: https://ethereal.email');
      
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
      console.error('Failed to create test account:', error);
      // Fall back to console logging for development
      return {
        sendMail: (mailOptions) => {
          console.log('Email would have been sent:');
          console.log('To:', mailOptions.to);
          console.log('Subject:', mailOptions.subject);
          console.log('Content:', mailOptions.text || mailOptions.html);
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
 * Send verification email
 * @param {string} to - Recipient email
 * @param {string} name - Recipient name
 * @param {string} token - Verification token
 * @returns {Promise} Nodemailer info
 */
const sendVerificationEmail = async (to, name, token) => {
  // Direct API verification URL (no client-side handling needed)
  const verificationUrl = `${CLIENT_URL}/auth/verify-email/${token}`;
  
  const transporter = await createTransporter();
  
  const mailOptions = {
    from: `"Second Opinion" <${EMAIL_FROM}>`,
    to,
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Welcome to Second Opinion!</h2>
        <p>Hello ${name},</p>
        <p>Thank you for registering with Second Opinion. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
        </div>
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <p style="word-break: break-all; color: #3b82f6;"><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <p>Best regards,<br>The Second Opinion Team</p>
      </div>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  
  // Log email URL for development
  if (process.env.NODE_ENV !== 'production' && (!EMAIL_USER || !EMAIL_PASS)) {
    console.log('Verification Email Preview URL:', nodemailer.getTestMessageUrl(info));
  }
  
  return info;
};

/**
 * Send password reset email
 * @param {string} to - Recipient email
 * @param {string} name - Recipient name
 * @param {string} token - Reset token
 * @returns {Promise} Nodemailer info
 */
const sendPasswordResetEmail = async (to, name, token) => {
  const resetUrl = `${CLIENT_URL}/auth/reset-password?token=${token}`;
  
  const transporter = await createTransporter();
  
  const mailOptions = {
    from: `"Second Opinion" <${EMAIL_FROM}>`,
    to,
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Password Reset Request</h2>
        <p>Hello ${name},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
        </div>
        <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
        <p style="word-break: break-all; color: #3b82f6;"><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <p>Best regards,<br>The Second Opinion Team</p>
      </div>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  
  // Log email URL for development
  if (process.env.NODE_ENV !== 'production' && (!EMAIL_USER || !EMAIL_PASS)) {
    console.log('Password Reset Email Preview URL:', nodemailer.getTestMessageUrl(info));
  }
  
  return info;
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};