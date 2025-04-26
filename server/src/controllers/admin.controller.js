const Admin = require('../models/admin.model');
const Patient = require('../models/patient.model');
const Doctor = require('../models/doctor.model');

// Get admin details
exports.getAdminDetails = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update admin details
exports.updateAdmin = async (req, res) => {
  try {
    // Don't allow password updates through this endpoint
    if (req.body.password) {
      delete req.body.password;
    }
    
    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    res.json(admin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().select('-password');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new admin (only super admin can do this)
exports.createAdmin = async (req, res) => {
  try {
    // Check if the requesting admin is a super admin
    const requestingAdmin = await Admin.findById(req.user.id);
    if (!requestingAdmin || requestingAdmin.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only super admins can create new admins' });
    }
    
    const admin = new Admin(req.body);
    await admin.save();
    
    // Remove password from response
    const adminResponse = admin.toObject();
    delete adminResponse.password;
    
    res.status(201).json(adminResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};