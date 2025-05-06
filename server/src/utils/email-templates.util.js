/**
 * Email templates for various notifications
 */

// Environment variables
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

/**
 * Generate verification email template with OTP
 * @param {string} name - Recipient name
 * @param {string} otp - Verification OTP
 * @param {string} userType - Type of user (user, doctor)
 * @returns {Object} Email subject and HTML content
 */
const verificationEmailTemplate = (name, otp, userType = 'patient') => {
  const subject = 'Verify Your Email - Second Opinion';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3b82f6;">Verify Your Email Address</h2>
      <p>Hello ${name || 'there'},</p>
      <p>Thank you for registering with Second Opinion. Please use the following verification code to complete your registration:</p>
      
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
        <h2 style="margin: 0; color: #1f2937; letter-spacing: 5px;">${otp}</h2>
      </div>
      
      <p>This code will expire in 60 minutes.</p>
      <p><strong>Note:</strong> After verification, you'll be automatically logged in to your account.</p>
      
      <p>If you did not create an account with Second Opinion, please ignore this email.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 12px; color: #6b7280;">
          &copy; ${new Date().getFullYear()} Second Opinion. All rights reserved.
        </p>
      </div>
    </div>
  `;
  
  return { subject, html };
};

/**
 * Generate password reset email template
 * @param {string} name - Recipient name
 * @param {string} token - Reset token
 * @param {string} email - Recipient email
 * @param {string} userType - Type of user (user, doctor, admin)
 * @returns {Object} Email subject and HTML content
 */
const passwordResetEmailTemplate = (name, token, email, userType = "patient") => {
  const resetUrl = `${CLIENT_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}&type=${userType}`;
  
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