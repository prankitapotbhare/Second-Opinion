const Doctor = require('../models/doctor.model');
const Availability = require('../models/availability.model');
const fs = require('fs');
const path = require('path');
const { DOCTOR_FILES_DIR, ALLOWED_DOCUMENT_TYPES } = require('../utils/constants');
const { createError } = require('../utils/error.util');
const userService = require('../services/user.service');
const fileService = require('../services/file.service');

// Get doctor profile (using authenticated user)
exports.getDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await userService.getUserProfile(Doctor, req.user.id);
    
    // Get availability information
    const availability = await Availability.findOne({ doctorId: doctor._id });
    
    res.status(200).json({
      success: true,
      data: {
        doctor,
        availability: availability || null
      }
    });
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

// Get doctor details (for admin or patient viewing a specific doctor)
exports.getDoctorDetails = async (req, res, next) => {
  try {
    const doctor = await userService.getUserDetails(Doctor, req.params.id);
    
    // Get availability information
    const availability = await Availability.findOne({ doctorId: doctor._id });
    
    res.status(200).json({
      success: true,
      data: {
        doctor,
        availability: availability || null
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create new doctor (admin function)
exports.createDoctor = async (req, res, next) => {
  try {
    const doctorResponse = await userService.createUser(Doctor, req.body);
    
    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: doctorResponse
    });
  } catch (error) {
    next(error);
  }
};

// Update doctor details (admin function)
exports.updateDoctor = async (req, res, next) => {
  try {
    const doctor = await userService.updateUser(Doctor, req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Doctor profile updated successfully',
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

// Complete doctor profile (using authenticated user)
exports.completeProfile = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    
    // Create doctor-specific directory for files
    const doctorDir = path.join(DOCTOR_FILES_DIR, doctorId);
    fileService.ensureDirectoryExists(doctorDir);
    
    // Process uploaded files
    const uploadedFiles = {};
    
    if (req.files) {
      // Handle registration certificate
      if (req.files.registrationCertificate && req.files.registrationCertificate.length > 0) {
        const file = req.files.registrationCertificate[0];
        uploadedFiles.registrationCertificate = {
          fileName: file.originalname,
          filePath: file.path,
          fileType: file.mimetype,
          fileSize: file.size
        };
      }
      
      // Handle government ID
      if (req.files.governmentId && req.files.governmentId.length > 0) {
        const file = req.files.governmentId[0];
        uploadedFiles.governmentId = {
          fileName: file.originalname,
          filePath: file.path,
          fileType: file.mimetype,
          fileSize: file.size
        };
      }
      
      // Handle profile photo
      if (req.files.profilePhoto && req.files.profilePhoto.length > 0) {
        const file = req.files.profilePhoto[0];
        uploadedFiles.profilePhoto = {
          fileName: file.originalname,
          filePath: file.path,
          fileType: file.mimetype,
          fileSize: file.size
        };
      }
    }
    
    const doctor = await Doctor.findById(doctorId);
    
    if (!doctor) {
      // Delete uploaded files if doctor not found
      if (req.files) {
        Object.keys(req.files).forEach(key => {
          req.files[key].forEach(file => {
            fileService.deleteFileIfExists(file.path);
          });
        });
      }
      
      return next(createError('Doctor not found', 404));
    }
    
    // Update doctor profile with form data
    if (req.body.specialization) {
      doctor.specialization = req.body.specialization;
    }
    
    if (req.body.experience) {
      doctor.experience = req.body.experience;
    }
    
    if (req.body.qualifications) {
      doctor.qualifications = req.body.qualifications;
    }
    
    if (req.body.bio) {
      doctor.bio = req.body.bio;
    }
    
    if (req.body.languages) {
      doctor.languages = req.body.languages.split(',').map(lang => lang.trim());
    }
    
    // Update document paths
    if (uploadedFiles.registrationCertificate) {
      doctor.documents.registrationCertificate = uploadedFiles.registrationCertificate.filePath;
    }
    
    if (uploadedFiles.governmentId) {
      doctor.documents.governmentId = uploadedFiles.governmentId.filePath;
    }
    
    // Update profile photo if uploaded
    if (uploadedFiles.profilePhoto) {
      doctor.photoURL = uploadedFiles.profilePhoto.filePath.replace(/\\/g, '/');
    }
    
    // Mark profile as completed
    doctor.profileCompleted = true;
    
    await doctor.save();
    
    res.status(200).json({
      success: true,
      message: 'Doctor profile completed successfully',
      data: {
        doctor: {
          id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          specialization: doctor.specialization,
          profileCompleted: doctor.profileCompleted,
          photoURL: doctor.photoURL
        }
      }
    });
  } catch (error) {
    // Delete uploaded files if an error occurs
    if (req.files) {
      Object.keys(req.files).forEach(key => {
        req.files[key].forEach(file => {
          fileService.deleteFileIfExists(file.path);
        });
      });
    }
    
    next(error);
  }
};

// Upload doctor documents (using authenticated user)
exports.uploadDocuments = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    
    const doctor = await Doctor.findById(doctorId);
    
    if (!doctor) {
      // Delete uploaded files if doctor not found
      if (req.files) {
        Object.keys(req.files).forEach(key => {
          req.files[key].forEach(file => {
            fileService.deleteFileIfExists(file.path);
          });
        });
      }
      
      return next(createError('Doctor not found', 404));
    }
    
    // Process uploaded files
    if (req.files) {
      // Handle registration certificate
      if (req.files.registrationCertificate && req.files.registrationCertificate.length > 0) {
        const file = req.files.registrationCertificate[0];
        doctor.documents.registrationCertificate = file.path;
      }
      
      // Handle government ID
      if (req.files.governmentId && req.files.governmentId.length > 0) {
        const file = req.files.governmentId[0];
        doctor.documents.governmentId = file.path;
      }
    }
    
    await doctor.save();
    
    res.status(200).json({
      success: true,
      message: 'Documents uploaded successfully',
      data: {
        documents: doctor.documents
      }
    });
  } catch (error) {
    // Delete uploaded files if an error occurs
    if (req.files) {
      Object.keys(req.files).forEach(key => {
        req.files[key].forEach(file => {
          fileService.deleteFileIfExists(file.path);
        });
      });
    }
    
    next(error);
  }
};

// Download doctor document
exports.downloadDocument = async (req, res, next) => {
  try {
    const { documentType } = req.params;
    let doctorId;
    
    // If admin is requesting a specific doctor's document
    if (req.user.role === 'admin' && req.params.id) {
      doctorId = req.params.id;
    } else {
      // Otherwise use the authenticated doctor's ID
      doctorId = req.user.id;
    }
    
    const doctor = await Doctor.findById(doctorId);
    
    if (!doctor) {
      return next(createError('Doctor not found', 404));
    }
    
    // Check if document exists
    if (!doctor.documents || !doctor.documents[documentType]) {
      return next(createError(`Document ${documentType} not found`, 404));
    }
    
    const documentPath = doctor.documents[documentType];
    
    // Stream the file to response
    fileService.streamFileToResponse(res, documentPath, path.basename(documentPath));
  } catch (error) {
    next(error);
  }
};

// Set doctor availability (using authenticated user)
exports.setAvailability = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    
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
      availability = new Availability({
        doctorId,
        ...req.body
      });
      await availability.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'Availability updated successfully',
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
    
    const availability = await Availability.findOne({ doctorId });
    
    if (!availability) {
      return res.status(200).json({
        success: true,
        message: 'No availability set',
        data: null
      });
    }
    
    res.status(200).json({
      success: true,
      data: availability
    });
  } catch (error) {
    next(error);
  }
};

// Get availability for a specific doctor (for patients or admins)
exports.getAvailability = async (req, res, next) => {
  try {
    const doctorId = req.params.id;
    
    const availability = await Availability.findOne({ doctorId });
    
    if (!availability) {
      return res.status(200).json({
        success: true,
        message: 'No availability set for this doctor',
        data: null
      });
    }
    
    res.status(200).json({
      success: true,
      data: availability
    });
  } catch (error) {
    next(error);
  }
};

// Get all doctors (for patients to browse)
exports.getAllDoctors = async (req, res, next) => {
  try {
    // Add filtering options
    const filter = { profileCompleted: true };
    
    // Add specialization filter if provided
    if (req.query.specialization) {
      filter.specialization = req.query.specialization;
    }
    
    const doctors = await Doctor.find(filter)
      .select('-password -documents -googleId')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    next(error);
  }
};