/**
 * Service for doctor-specific operations
 */
const Doctor = require('../models/doctor.model');
const Availability = require('../models/availability.model');
const { createError } = require('../utils/error.util');
const mongoose = require('mongoose');

/**
 * Get doctor with availability
 * @param {string} doctorId - Doctor ID
 * @returns {Promise<Object>} Doctor with availability
 */
exports.getDoctorWithAvailability = async (doctorId) => {
  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    throw createError('Invalid doctor ID', 400);
  }
  
  const doctor = await Doctor.findById(doctorId).select('-password');
  
  if (!doctor) {
    throw createError('Doctor not found', 404);
  }
  
  // Get availability information
  const availability = await Availability.findOne({ doctorId: doctor._id });
  
  return {
    doctor,
    availability: availability || null
  };
};

/**
 * Get all doctors with pagination
 * @param {Object} filter - Filter criteria
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {string} sort - Sort criteria
 * @returns {Promise<Object>} Paginated doctors
 */
exports.getAllDoctors = async (filter = {}, page = 1, limit = 10, sort = '-createdAt') => {
  const skip = (page - 1) * limit;
  
  const doctors = await Doctor.find(filter)
    .select('-password')
    .sort(sort)
    .skip(skip)
    .limit(limit);
  
  const total = await Doctor.countDocuments(filter);
  
  return {
    doctors,
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages: Math.ceil(total / limit)
  };
};

/**
 * Set doctor availability
 * @param {string} doctorId - Doctor ID
 * @param {Object} availabilityData - Availability data
 * @returns {Promise<Object>} Updated availability
 */
exports.setAvailability = async (doctorId, availabilityData) => {
  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    throw createError('Invalid doctor ID', 400);
  }
  
  // Check if doctor exists
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw createError('Doctor not found', 404);
  }
  
  // Find existing availability or create new one
  let availability = await Availability.findOne({ doctorId });
  
  if (availability) {
    // Update existing availability
    Object.keys(availabilityData).forEach(key => {
      availability[key] = availabilityData[key];
    });
    
    await availability.save();
  } else {
    // Create new availability
    availability = await Availability.create({
      doctorId,
      ...availabilityData
    });
  }
  
  return availability;
};

/**
 * Get doctor availability
 * @param {string} doctorId - Doctor ID
 * @returns {Promise<Object>} Availability
 */
exports.getAvailability = async (doctorId) => {
  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    throw createError('Invalid doctor ID', 400);
  }
  
  const availability = await Availability.findOne({ doctorId });
  
  if (!availability) {
    throw createError('Availability not found for this doctor', 404);
  }
  
  return availability;
};

/**
 * Process doctor documents
 * @param {Object} files - Uploaded files
 * @returns {Object} Processed document objects
 */
exports.processDocuments = (files) => {
  const documents = {};
  
  if (files) {
    // Handle registration certificate
    if (files.registrationCertificate && files.registrationCertificate.length > 0) {
      const file = files.registrationCertificate[0];
      documents.registrationCertificate = {
        fileName: file.originalname,
        filePath: file.path,
        fileType: file.mimetype,
        fileSize: file.size
      };
    }
    
    // Handle government ID
    if (files.governmentId && files.governmentId.length > 0) {
      const file = files.governmentId[0];
      documents.governmentId = {
        fileName: file.originalname,
        filePath: file.path,
        fileType: file.mimetype,
        fileSize: file.size
      };
    }
    
    // Handle profile photo
    if (files.profilePhoto && files.profilePhoto.length > 0) {
      const file = files.profilePhoto[0];
      documents.profilePhoto = file.path;
    }
  }
  
  return documents;
};