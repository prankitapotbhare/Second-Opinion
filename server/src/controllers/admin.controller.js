const Admin = require('../models/admin.model');
const Patient = require('../models/patient.model');
const Doctor = require('../models/doctor.model');
const { createError } = require('../utils/error.util');

// Get admin profile (using authenticated user)
exports.getAdminProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    if (!admin) {
      return next(createError('Admin not found', 404));
    }
    
    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    next(error);
  }
};

// Update admin profile (using authenticated user)
exports.updateAdminProfile = async (req, res, next) => {
  try {
    // Don't allow password updates through this endpoint
    if (req.body.password) {
      delete req.body.password;
    }
    
    // Don't allow role changes through this endpoint
    if (req.body.role) {
      delete req.body.role;
    }
    
    const admin = await Admin.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!admin) {
      return next(createError('Admin not found', 404));
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

// Get all patients
exports.getAllPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find().select('-password');
    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    next(error);
  }
};

// Get all doctors
exports.getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find().select('-password');
    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
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
      return next(createError('Only super admins can create new admins', 403));
    }
    
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
    const patient = await Patient.findByIdAndDelete(req.params.id);
    
    if (!patient) {
      return next(createError('Patient not found', 404));
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
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    
    if (!doctor) {
      return next(createError('Doctor not found', 404));
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
      return next(createError('Only super admins can delete admins', 403));
    }
    
    // Prevent deleting yourself
    if (req.params.id === req.user.id) {
      return next(createError('You cannot delete your own account', 400));
    }
    
    const admin = await Admin.findByIdAndDelete(req.params.id);
    
    if (!admin) {
      return next(createError('Admin not found', 404));
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
      return next(createError('Only super admins can view all admins', 403));
    }
    
    const admins = await Admin.find().select('-password');
    
    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    next(error);
  }
};