const jwt = require('jsonwebtoken');
const Patient = require('../models/patient.model');
const Doctor = require('../models/doctor.model');
const Admin = require('../models/admin.model');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Get the appropriate model based on user role
 * @param {string} role - User role (patient, doctor, admin)
 * @returns {Model} Mongoose model
 */
const getModelByRole = (role) => {
  switch (role) {
    case 'doctor':
      return Doctor;
    case 'admin':
      return Admin;
    case 'patient':
    case 'user':
    default:
      return Patient;
  }
};

/**
 * Middleware to authenticate user
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - No token provided'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - Token expired',
          tokenExpired: true
        });
      }
      
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - Invalid token'
      });
    }

    // Get user from token
    const UserModel = getModelByRole(decoded.role || 'patient');
    const user = await UserModel.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not found'
      });
    }

    // Add user to request
    req.user = {
      id: user._id,
      role: decoded.role || user.role,
      email: user.email,
      name: user.name
    };

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to check user role
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - You do not have permission to access this resource'
      });
    }

    next();
  };
};

module.exports = { 
  getModelByRole,
  authenticate,
  checkRole
};