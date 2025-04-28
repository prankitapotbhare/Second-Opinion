const Doctor = require('../models/doctor.model');
const Availability = require('../models/availability.model');
const { createError } = require('../utils/error.util');
const fileService = require('../services/file.service');
const mongoose = require('mongoose');

// Get doctor profile (using authenticated user)
exports.getDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.user.id).select('-password');
    
    if (!doctor) {
      return next(createError('Doctor not found', 404));
    }
    
    res.status(200).json({
      success: true,
      message: 'Doctor profile retrieved successfully',
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

// Update doctor profile (using authenticated user)
exports.updateDoctorProfile = async (req, res, next) => {
  try {
    // Don't allow password updates through this function
    if (req.body.password) {
      delete req.body.password;
    }
    
    // Don't allow role changes through this function
    if (req.body.role) {
      delete req.body.role;
    }
    
    const doctor = await Doctor.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!doctor) {
      return next(createError('Doctor not found', 404));
    }
    
    res.status(200).json({
      success: true,
      message: 'Doctor profile updated successfully',
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

// Complete doctor profile with documents (using authenticated user)
exports.completeProfile = async (req, res, next) => {
  try {
    // Process uploaded documents using file service
    const documents = fileService.processDocuments(req.files);
    
    // Validate required fields for profile completion
    const requiredFields = ['specialization', 'experience', 'licenseNumber', 'education'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return next(createError(`Missing required fields: ${missingFields.join(', ')}`, 400));
    }
    
    // Update doctor profile with documents and additional information
    const updateData = {
      ...req.body,
      isProfileComplete: true,
      profileCompletedAt: new Date()
    };
    
    // Add document paths if they exist
    if (documents.registrationCertificate) {
      updateData.registrationCertificate = documents.registrationCertificate;
    }
    
    if (documents.governmentId) {
      updateData.governmentId = documents.governmentId;
    }
    
    if (documents.profilePhoto) {
      updateData.photoURL = documents.profilePhoto;
    }
    
    const doctor = await Doctor.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!doctor) {
      return next(createError('Doctor not found', 404));
    }
    
    res.status(200).json({
      success: true,
      message: 'Profile completed successfully',
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

// Upload doctor documents (using authenticated user)
exports.uploadDocuments = async (req, res, next) => {
  try {
    // Process uploaded documents using file service
    const documents = fileService.processDocuments(req.files);
    
    // Update doctor profile with documents
    const updateData = {};
    
    if (documents.registrationCertificate) {
      updateData.registrationCertificate = documents.registrationCertificate;
    }
    
    if (documents.governmentId) {
      updateData.governmentId = documents.governmentId;
    }
    
    const doctor = await Doctor.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!doctor) {
      return next(createError('Doctor not found', 404));
    }
    
    res.status(200).json({
      success: true,
      message: 'Documents uploaded successfully',
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

// Download doctor document (using authenticated user)
exports.downloadDocument = async (req, res, next) => {
  try {
    const { documentType } = req.params;
    
    // Validate document type
    const allowedDocumentTypes = ['registrationCertificate', 'governmentId'];
    if (!allowedDocumentTypes.includes(documentType)) {
      return next(createError(`Invalid document type. Allowed values: ${allowedDocumentTypes.join(', ')}`, 400));
    }
    
    const doctor = await Doctor.findById(req.user.id);
    
    if (!doctor) {
      return next(createError('Doctor not found', 404));
    }
    
    // Check if document exists
    if (!doctor[documentType] || !doctor[documentType].filePath) {
      return next(createError('Document not found', 404));
    }
    
    const filePath = doctor[documentType].filePath;
    const fileName = doctor[documentType].fileName;
    
    // Stream file to response using file service
    fileService.streamFileToResponse(res, filePath, fileName, true);
  } catch (error) {
    next(error);
  }
};

// Set doctor availability (using authenticated user)
exports.setAvailability = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    
    // Validate required fields
    const requiredFields = ['workingDays', 'startTime', 'endTime'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return next(createError(`Missing required fields: ${missingFields.join(', ')}`, 400));
    }
    
    // Check if availability already exists
    let availability = await Availability.findOne({ doctorId });
    
    if (availability) {
      // Update existing availability
      availability = await Availability.findOneAndUpdate(
        { doctorId },
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      // Create new availability
      availability = await Availability.create({
        doctorId,
        ...req.body
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Availability set successfully',
      data: availability
    });
  } catch (error) {
    next(error);
  }
};

// Get doctor availability (using authenticated user)
exports.getDoctorAvailability = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    
    // Find availability
    const availability = await Availability.findOne({ doctorId });
    
    if (!availability) {
      return next(createError('Availability not found for this doctor', 404));
    }
    
    res.status(200).json({
      success: true,
      message: 'Availability retrieved successfully',
      data: availability
    });
  } catch (error) {
    next(error);
  }
};

// Get all doctors (for patients or admin)
exports.getAllDoctors = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || '-createdAt';
    
    // Build filter based on query parameters
    const filter = {};
    
    if (req.query.specialization) {
      filter.specialization = req.query.specialization;
    }
    
    if (req.query.experience) {
      filter.experience = { $gte: parseInt(req.query.experience) };
    }
    
    // Only return doctors with completed profiles
    filter.isProfileComplete = true;
    
    // Execute query with pagination
    const doctors = await Doctor.find(filter)
      .select('-password -registrationCertificate -governmentId')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    // Get total count
    const total = await Doctor.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      message: 'Doctors retrieved successfully',
      data: doctors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get doctor details by ID (for patients or admin)
exports.getDoctorDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid doctor ID', 400));
    }
    
    // Find doctor
    const doctor = await Doctor.findById(id)
      .select('-password -registrationCertificate -governmentId');
    
    if (!doctor) {
      return next(createError('Doctor not found', 404));
    }
    
    // Get availability
    const availability = await Availability.findOne({ doctorId: id });
    
    res.status(200).json({
      success: true,
      message: 'Doctor details retrieved successfully',
      data: {
        doctor,
        availability: availability || null
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get doctor availability by ID (for patients)
exports.getAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError('Invalid doctor ID', 400));
    }
    
    // Find availability
    const availability = await Availability.findOne({ doctorId: id });
    
    if (!availability) {
      return next(createError('Availability not found for this doctor', 404));
    }
    
    res.status(200).json({
      success: true,
      message: 'Availability retrieved successfully',
      data: availability
    });
  } catch (error) {
    next(error);
  }
};