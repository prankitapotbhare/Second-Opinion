const Doctor = require('../models/doctor.model');
const { DOCTOR_FILES_DIR } = require('../utils/constants');
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

// Get availability for a specific doctor (for patients)
exports.getAvailability = async (req, res, next) => {
  try {
    validationService.validateObjectId(req.params.id, 'doctor');
    const availability = await doctorService.getAvailability(req.params.id);
    responseService.sendSuccess(res, 'Availability retrieved successfully', availability);
  } catch (error) {
    next(error);
  }
};

// Get all doctors (for patients and admins)
exports.getAllDoctors = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Only show doctors with complete profiles
    const filter = { isProfileComplete: true };
    
    // Add specialization filter if provided
    if (req.query.specialization) {
      filter.specialization = req.query.specialization;
    }
    
    const result = await doctorService.getAllDoctors(filter, page, limit);
    
    responseService.sendPaginated(
      res, 
      'Doctors retrieved successfully', 
      result.doctors, 
      result.page, 
      result.limit, 
      result.total
    );
  } catch (error) {
    next(error);
  }
};

// Get doctor details (for patients and admins)
exports.getDoctorDetails = async (req, res, next) => {
  try {
    validationService.validateObjectId(req.params.id, 'doctor');
    
    const { doctor, availability } = await doctorService.getDoctorWithAvailability(req.params.id);
    
    responseService.sendSuccess(res, 'Doctor details retrieved successfully', {
      doctor,
      availability
    });
  } catch (error) {
    next(error);
  }
};

// Create new doctor (admin function)
exports.createDoctor = async (req, res, next) => {
  try {
    // Only allow admins to access this endpoint
    if (req.user.role !== 'admin') {
      return responseService.sendForbidden(res, 'Not authorized to access this resource');
    }
    
    // Validate required fields
    validationService.validateRequiredFields(req.body, ['name', 'email', 'password']);
    
    // Validate email format
    validationService.validateEmail(req.body.email);
    
    const doctorResponse = await userService.createUser(Doctor, req.body);
    responseService.sendSuccess(res, 'Doctor created successfully', doctorResponse, 201);
  } catch (error) {
    next(error);
  }
};

// Update doctor (admin function)
exports.updateDoctor = async (req, res, next) => {
  try {
    // Only allow admins to access this endpoint
    if (req.user.role !== 'admin') {
      return responseService.sendForbidden(res, 'Not authorized to access this resource');
    }
    
    validationService.validateObjectId(req.params.id, 'doctor');
    const doctor = await userService.updateUser(Doctor, req.params.id, req.body);
    responseService.sendSuccess(res, 'Doctor updated successfully', doctor);
  } catch (error) {
    next(error);
  }
};

// Delete doctor (admin function)
exports.deleteDoctor = async (req, res, next) => {
  try {
    // Only allow admins to access this endpoint
    if (req.user.role !== 'admin') {
      return responseService.sendForbidden(res, 'Not authorized to access this resource');
    }
    
    validationService.validateObjectId(req.params.id, 'doctor');
    await userService.deleteUser(Doctor, req.params.id);
    responseService.sendSuccess(res, 'Doctor deleted successfully');
  } catch (error) {
    next(error);
  }
};