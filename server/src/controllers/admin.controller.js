const Admin = require('../models/admin.model');
const Patient = require('../models/patient.model');
const Doctor = require('../models/doctor.model');
const PatientDetails = require('../models/patientDetails.model');
const validationService = require('../services/validation.service');
const mongoose = require('mongoose');

exports.getStats = async (req, res, next) => {
  try {
    // Get counts from each model
    const [
      totalDoctors,
      totalPatients,
      completedAppointments,
      pendingAppointments
    ] = await Promise.all([
      Doctor.countDocuments({}),
      Patient.countDocuments({}),
      PatientDetails.countDocuments({ status: 'completed' }),
      PatientDetails.countDocuments({ status: 'pending' })
    ]);

    // Return the statistics
    res.status(200).json({
      success: true,
      message: 'Admin statistics retrieved successfully',
      data: {
        totalDoctors,
        totalPatients,
        completedAppointments,
        pendingAppointments
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

// Get doctor by ID (admin function)
exports.getDoctorById = async (req, res, next) => {
  
}

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

// Get patient by ID (admin function)
exports.getPatientById = async (req, res, next) => {
  
}