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
    
    // Get basic doctor information
    const doctors = await Doctor.find({})
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Doctor.countDocuments({});
    const totalPages = Math.ceil(total / limit);
    
    // Enhance doctor data with appointment statistics
    const enhancedDoctors = await Promise.all(doctors.map(async (doctor) => {
      // Get total appointments for this doctor
      const totalAppointments = await PatientDetails.countDocuments({ 
        doctorId: doctor._id 
      });
      
      // Get accepted/completed appointments for this doctor
      const acceptedAppointments = await PatientDetails.countDocuments({ 
        doctorId: doctor._id,
        status: 'completed'
      });
      
      // Return formatted doctor data
      return {
        id: doctor._id,
        name: doctor.name || `Dr. ${doctor.firstName || ''} ${doctor.lastName || ''}`.trim(),
        specialty: doctor.specialization || doctor.specialty || 'General',
        totalAppointments,
        acceptedAppointments,
        // Include other fields that might be needed
        email: doctor.email,
        photoURL: doctor.photoURL,
        createdAt: doctor.createdAt
      };
    }));
    
    res.status(200).json({
      success: true,
      message: 'Doctors retrieved successfully',
      data: enhancedDoctors,
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