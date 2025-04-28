const Admin = require('../models/admin.model');
const Patient = require('../models/patient.model');
const Doctor = require('../models/doctor.model');
const userService = require('../services/user.service');
const validationService = require('../services/validation.service');

// Get admin profile (using authenticated user)
exports.getAdminProfile = async (req, res, next) => {
  try {
    const admin = await userService.getUserProfile(Admin, req.user.id);
    res.status(200).json({
      success: true,
      message: 'Admin profile retrieved successfully',
      data: admin
    });
  } catch (error) {
    next(error);
  }
};

// Update admin profile (using authenticated user)
exports.updateAdminProfile = async (req, res, next) => {
  try {
    const admin = await userService.updateUserProfile(Admin, req.user.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Admin profile updated successfully',
      data: admin
    });
  } catch (error) {
    next(error);
  }
};

// Get all patients (admin function)
exports.getAllPatients = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await userService.getAllUsers(Patient, {}, page, limit);
    
    const totalPages = Math.ceil(result.total / result.limit);
    
    res.status(200).json({
      success: true,
      message: 'Patients retrieved successfully',
      data: result.users,
      pagination: {
        page: Number(result.page),
        limit: Number(result.limit),
        total: result.total,
        totalPages,
        hasNext: result.page < totalPages,
        hasPrev: result.page > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all doctors (admin function)
exports.getAllDoctors = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await userService.getAllUsers(Doctor, {}, page, limit);
    
    const totalPages = Math.ceil(result.total / result.limit);
    
    res.status(200).json({
      success: true,
      message: 'Doctors retrieved successfully',
      data: result.users,
      pagination: {
        page: Number(result.page),
        limit: Number(result.limit),
        total: result.total,
        totalPages,
        hasNext: result.page < totalPages,
        hasPrev: result.page > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create a new admin (only super admin can do this)
exports.createAdmin = async (req, res, next) => {
  try {
    // Check if the requesting admin is a super admin
    const requestingAdmin = await Admin.findById(req.user.id);
    if (!requestingAdmin || requestingAdmin.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admins can create new admins'
      });
    }
    
    // Validate required fields
    validationService.validateRequiredFields(req.body, ['name', 'email', 'password']);
    
    // Validate email format
    validationService.validateEmail(req.body.email);
    
    const adminResponse = await userService.createUser(Admin, req.body);
    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: adminResponse
    });
  } catch (error) {
    next(error);
  }
};

// Delete patient (admin function)
exports.deletePatient = async (req, res, next) => {
  try {
    validationService.validateObjectId(req.params.id, 'patient');
    await userService.deleteUser(Patient, req.params.id);
    res.status(200).json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete doctor (admin function)
exports.deleteDoctor = async (req, res, next) => {
  try {
    validationService.validateObjectId(req.params.id, 'doctor');
    await userService.deleteUser(Doctor, req.params.id);
    res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete admin (super admin function)
exports.deleteAdmin = async (req, res, next) => {
  try {
    // Check if the requesting admin is a super admin
    const requestingAdmin = await Admin.findById(req.user.id);
    if (!requestingAdmin || requestingAdmin.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admins can delete admins'
      });
    }
    
    // Prevent deleting yourself
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }
    
    validationService.validateObjectId(req.params.id, 'admin');
    await userService.deleteUser(Admin, req.params.id);
    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get all admins (super admin function)
exports.getAllAdmins = async (req, res, next) => {
  try {
    // Check if the requesting admin is a super admin
    const requestingAdmin = await Admin.findById(req.user.id);
    if (!requestingAdmin || requestingAdmin.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admins can view all admins'
      });
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await userService.getAllUsers(Admin, {}, page, limit);
    
    const totalPages = Math.ceil(result.total / result.limit);
    
    res.status(200).json({
      success: true,
      message: 'Admins retrieved successfully',
      data: result.users,
      pagination: {
        page: Number(result.page),
        limit: Number(result.limit),
        total: result.total,
        totalPages,
        hasNext: result.page < totalPages,
        hasPrev: result.page > 1
      }
    });
  } catch (error) {
    next(error);
  }
};