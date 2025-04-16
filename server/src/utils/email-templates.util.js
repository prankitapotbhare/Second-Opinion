/**
 * Email templates for various notifications
 */

// Environment variables
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

/**
 * Generate verification email template
 * @param {string} name - Recipient name
 * @param {string} token - Verification token
 * @returns {Object} Email subject and HTML content
 */
const verificationEmailTemplate = (name, token, email) => {
  const verificationUrl = `${CLIENT_URL}/verify-email?token=${token}&email=${email}`;
  
  return {
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
};

/**
 * Generate password reset email template
 * @param {string} name - Recipient name
 * @param {string} token - Reset token
 * @returns {Object} Email subject and HTML content
 */
const passwordResetEmailTemplate = (name, token) => {
  const resetUrl = `${CLIENT_URL}/reset-password?token=${token}`;
  
  return {
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
};

module.exports = {
  verificationEmailTemplate,
  passwordResetEmailTemplate
};