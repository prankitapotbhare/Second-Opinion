const Admin = require('../models/admin.model');
const Patient = require('../models/patient.model');
const Doctor = require('../models/doctor.model');
const validationService = require('../services/validation.service');
const mongoose = require('mongoose');

// Get admin profile (using authenticated user)
exports.getAdminProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    
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
    // Don't allow password updates through this function
    if (req.body.password) {
      delete req.body.password;
    }
    
    // Don't allow role changes through this function
    if (req.body.role) {
      delete req.body.role;
    }
    
    const admin = await Admin.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    
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
    const skip = (page - 1) * limit;
    const sort = '-createdAt';
    
    const patients = await Patient.find({})
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await Patient.countDocuments({});
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      success: true,
      message: 'Patients retrieved successfully',
      data: patients,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
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
    const skip = (page - 1) * limit;
    const sort = '-createdAt';
    
    const doctors = await Doctor.find({})
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await Doctor.countDocuments({});
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      success: true,
      message: 'Doctors retrieved successfully',
      data: doctors,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
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
    
    // Create new admin
    const admin = new Admin(req.body);
    await admin.save();
    
    // Remove password from response
    const adminResponse = admin.toObject();
    delete adminResponse.password;
    
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
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID'
      });
    }
    
    const patient = await Patient.findByIdAndDelete(req.params.id);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
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
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID'
      });
    }
    
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
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
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid admin ID'
      });
    }
    
    const admin = await Admin.findByIdAndDelete(req.params.id);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    
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
    const skip = (page - 1) * limit;
    const sort = '-createdAt';
    
    const admins = await Admin.find({})
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await Admin.countDocuments({});
    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      success: true,
      message: 'Admins retrieved successfully',
      data: admins,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
};