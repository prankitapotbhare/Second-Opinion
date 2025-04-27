/**
 * Middleware to restrict admin users from accessing certain auth routes
 * Admin users should only be able to use specific routes: login, refresh-token, logout, 
 * request-password-reset, and reset-password
 */
const errorUtil = require('../utils/error.util'); // Add this import

const restrictAdminAuth = (req, res, next) => {
  // Check if the request is trying to register as admin
  if (req.body && req.body.role === 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin registration is not allowed through the API'
    });
  }
  
  // For email-based routes, check if the email belongs to an admin
  if (req.body && req.body.email) {
    // This requires a database lookup
    const Patient = require('../models/patient.model');
    const Doctor = require('../models/doctor.model');
    const Admin = require('../models/admin.model');

    const email = req.body.email;
    
    // Use an async function to check the user role
    const checkUserRole = async () => {
      try {
          // Try each model in sequence
          let user, userModel; // Define variables
          
          user = await Patient.findOne({ email });
          if (user) userModel = Patient;
          
          if (!user) {
            user = await Doctor.findOne({ email });
            if (user) userModel = Doctor;
          }
          
          if (!user) {
            user = await Admin.findOne({ email });
            if (user) userModel = Admin;
          }
          
          if (!user) {
            // Use a simple error object if errorUtil is not available as fallback
            next();
            return;
          }
        
        // If user exists and is an admin, restrict access to non-allowed routes
        if (user && user.role === 'admin') {
          // List of allowed routes for admin
          const allowedRoutes = [
            '/login', 
            '/refresh-token', 
            '/logout', 
            '/request-password-reset'
          ];
          
          // Check if the current path is in the allowed list
          // Also allow reset-password route which has a token parameter
          if (allowedRoutes.includes(req.path) || req.path.startsWith('/reset-password/')) {
            return next();
          }
          
          return res.status(403).json({
            success: false,
            message: 'Admin users can only use specific authentication routes'
          });
        }
        
        // For non-admin users or non-existent users, proceed normally
        next();
      } catch (error) {
        next(error);
      }
    };
    
    return checkUserRole();
  }
  
  // For all other requests, proceed normally
  next();
};

module.exports = { restrictAdminAuth };