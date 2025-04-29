const Doctor = require('../models/doctor.model');
const Availability = require('../models/availability.model');
const { createError } = require('../utils/error.util');
const fileService = require('../services/file.service');

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
    
    // Don't allow email updates through this function
    if (req.body.email) {
      delete req.body.email;
    }
    
    // Process uploaded documents if any
    const updateData = { ...req.body };
    
    if (req.files) {
      // Process uploaded documents
      const documents = fileService.processDocuments(req.files);
      
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
    const requiredFields = ['specialization', 'experience', 'licenseNumber', 'degree'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return next(createError(`Missing required fields: ${missingFields.join(', ')}`, 400));
    }
    
    // Validate gender if provided
    if (req.body.gender && !['Male', 'Female', 'Other'].includes(req.body.gender)) {
      return next(createError('Invalid gender value. Must be Male, Female, or Other', 400));
    }
    
    // Don't allow email updates through this function
    if (req.body.email) {
      delete req.body.email;
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

// Delete doctor account
exports.deleteAccount = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    
    // Find the doctor
    const doctor = await Doctor.findById(doctorId);
    
    if (!doctor) {
      return next(createError('Doctor not found', 404));
    }
    
    // Delete doctor's documents if they exist
    if (doctor.registrationCertificate && doctor.registrationCertificate.filePath) {
      fileService.deleteFileIfExists(doctor.registrationCertificate.filePath);
    }
    
    if (doctor.governmentId && doctor.governmentId.filePath) {
      fileService.deleteFileIfExists(doctor.governmentId.filePath);
    }
    
    // Delete doctor's availability
    await Availability.findOneAndDelete({ doctorId });
    
    // Delete doctor account
    await Doctor.findByIdAndDelete(doctorId);
    
    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// --- PUBLIC: Get doctors with filters ---
exports.getDoctorsPublic = async (req, res, next) => {
  try {
    const { location, department, limit = 10, page = 1 } = req.query;
    const query = {};

    if (location) {
      query.location = { $regex: new RegExp(location, 'i') };
    }
    if (department) {
      query.specialization = { $regex: new RegExp(department, 'i') };
    }

    // Only show doctors with completed profiles
    query.isProfileComplete = true;

    const doctors = await Doctor.find(query)
      .select('_id name specialization degree experience')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.status(200).json({
      success: true,
      data: doctors
    });
  } catch (error) {
    next(error);
  }
};