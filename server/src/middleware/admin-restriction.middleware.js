/**
 * Middleware to restrict admin users from accessing certain auth routes
 * Admin users should only be able to use specific routes: login, refresh-token, logout, 
 * request-password-reset, and reset-password
 */
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
    const User = require('../models/user.model');
    
    // Use an async function to check the user role
    const checkUserRole = async () => {
      try {
        const user = await User.findOne({ email: req.body.email });
        
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