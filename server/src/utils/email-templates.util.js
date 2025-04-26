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
  const subject = 'Verify Your Email Address';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #3b82f6;">Verify Your Email Address</h2>
      <p>Hello ${name},</p>
      <p>Thank you for registering with Second Opinion. To complete your registration, please use the following verification code:</p>
      
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
        ${otp}
      </div>
      
      <p>This code will expire in 1 hour.</p>
      <p>If you did not request this verification, please ignore this email.</p>
      <p>Best regards,<br>The Second Opinion Team</p>
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
const passwordResetEmailTemplate = (name, token, email, userType = 'user') => {
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