const Doctor = require('../models/doctor.model');
const { createError } = require('../utils/error.util');
const userService = require('../services/user.service');
const fileService = require('../services/file.service');
const doctorService = require('../services/doctor.service');
const responseService = require('../services/response.service');
const validationService = require('../services/validation.service');

// Get doctor profile (using authenticated user)
exports.getDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await userService.getUserProfile(Doctor, req.user.id);
    responseService.sendSuccess(res, 'Doctor profile retrieved successfully', doctor);
  } catch (error) {
    next(error);
  }
};

// Update doctor profile (using authenticated user)
exports.updateDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await userService.updateUserProfile(Doctor, req.user.id, req.body);
    
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
    // Process uploaded documents
    const documents = doctorService.processDocuments(req.files);
    
    // Validate required fields
    validationService.validateRequiredFields(req.body, [
      'specialization', 'experience', 'licenseNumber', 'education'
    ]);
    
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
    
    const doctor = await userService.updateUserProfile(Doctor, req.user.id, updateData);
    responseService.sendSuccess(res, 'Profile completed successfully', doctor);
  } catch (error) {
    next(error);
  }
};

// Upload doctor documents (using authenticated user)
exports.uploadDocuments = async (req, res, next) => {
  try {
    // Process uploaded documents
    const documents = doctorService.processDocuments(req.files);
    
    // Update doctor profile with documents
    const updateData = {};
    
    // Add document paths if they exist
    if (documents.registrationCertificate) {
      updateData.registrationCertificate = documents.registrationCertificate;
    }
    
    if (documents.governmentId) {
      updateData.governmentId = documents.governmentId;
    }
    
    const doctor = await userService.updateUserProfile(Doctor, req.user.id, updateData);
    responseService.sendSuccess(res, 'Documents uploaded successfully', doctor);
  } catch (error) {
    next(error);
  }
};

// Download a specific document (using authenticated user)
exports.downloadDocument = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const { documentType } = req.params;
    
    // Validate document type
    validationService.validateAllowedValues(
      documentType, 
      ['registrationCertificate', 'governmentId'], 
      'document type'
    );
    
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      throw createError('Doctor not found', 404);
    }
    
    // Get the document
    const document = doctor[documentType];
    if (!document || !document.filePath) {
      throw createError('Document not found', 404);
    }
    
    // Stream the file to response
    fileService.streamFileToResponse(res, document.filePath, document.fileName);
  } catch (error) {
    next(error);
  }
};

// Set doctor availability (using authenticated user)
exports.setAvailability = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    
    // Validate required fields
    validationService.validateRequiredFields(req.body, ['availableDays', 'availableTimeSlots']);
    
    const availability = await doctorService.setAvailability(doctorId, req.body);
    responseService.sendSuccess(res, 'Availability set successfully', availability);
  } catch (error) {
    next(error);
  }
};

// Get doctor availability (using authenticated user)
exports.getDoctorAvailability = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const availability = await doctorService.getAvailability(doctorId);
    responseService.sendSuccess(res, 'Availability retrieved successfully', availability);
  } catch (error) {
    next(error);
  }
};