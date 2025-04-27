const Patient = require('../models/patient.model');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { MEDICAL_FILES_DIR } = require('../utils/constants');
const { createError } = require('../utils/error.util');
const userService = require('../services/user.service');
const fileService = require('../services/file.service');

// Get patient profile (using authenticated user)
exports.getPatientProfile = async (req, res, next) => {
  try {
    const patient = await userService.getUserProfile(Patient, req.user.id);
    
    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

// Update patient profile (using authenticated user)
exports.updatePatientProfile = async (req, res, next) => {
  try {
    const patient = await userService.updateUserProfile(Patient, req.user.id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Patient profile updated successfully',
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

// Get patient details (for admin or doctor viewing a specific patient)
exports.getPatientDetails = async (req, res, next) => {
  try {
    const patient = await userService.getUserDetails(Patient, req.params.id);
    
    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

// Create new patient (admin function)
exports.createPatient = async (req, res, next) => {
  try {
    const patientResponse = await userService.createUser(Patient, req.body);
    
    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: patientResponse
    });
  } catch (error) {
    next(error);
  }
};

// Update patient details (admin function)
exports.updatePatient = async (req, res, next) => {
  try {
    const patient = await userService.updateUser(Patient, req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Patient profile updated successfully',
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

// Submit a form (using authenticated user)
exports.submitForm = async (req, res, next) => {
  try {
    const patientId = req.user.id;
    
    const { doctorId, age, gender, phone, emergencyContact, problem } = req.body;
    
    // Validate required fields
    if (!doctorId || !age || !gender || !phone || !problem) {
      // Delete uploaded files if validation fails
      fileService.deleteFiles(req.files);
      
      return next(createError('Missing required fields', 400));
    }
    
    // Validate age
    if (isNaN(age) || age <= 0 || age > 120) {
      // Delete uploaded files if validation fails
      fileService.deleteFiles(req.files);
      
      return next(createError('Invalid age value', 400));
    }
    
    // Validate gender
    if (!['Male', 'Female', 'Other'].includes(gender)) {
      // Delete uploaded files if validation fails
      fileService.deleteFiles(req.files);
      
      return next(createError('Invalid gender value', 400));
    }
    
    const patient = await Patient.findById(patientId);
    if (!patient) {
      // Delete uploaded files if patient not found
      fileService.deleteFiles(req.files);
      
      return next(createError('Patient not found', 404));
    }
    
    // Process uploaded files
    const medicalFiles = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        medicalFiles.push({
          fileName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          uploadDate: new Date(),
          filePath: file.path
        });
      });
    }
    
    // Create new form submission
    const newFormSubmission = {
      doctorId,
      age,
      gender,
      phone,
      emergencyContact,
      problem,
      medicalFiles,
      status: 'pending',
      submittedAt: new Date()
    };
    
    // Add form submission to patient's formSubmissions array
    patient.formSubmissions.push(newFormSubmission);
    await patient.save();
    
    // Return the newly created form submission
    const formSubmission = patient.formSubmissions[patient.formSubmissions.length - 1];
    
    res.status(201).json({
      success: true,
      message: 'Form submitted successfully',
      data: {
        formSubmission
      }
    });
  } catch (error) {
    // Delete uploaded files if an error occurs
    fileService.deleteFiles(req.files);
    
    next(error);
  }
};

// Get patient's form submissions (using authenticated user)
exports.getFormSubmissions = async (req, res, next) => {
  try {
    let patientId;
    
    // If admin or doctor is requesting a specific patient's forms
    if ((req.user.role === 'admin' || req.user.role === 'doctor') && req.params.id) {
      patientId = req.params.id;
    } else {
      // Otherwise use the authenticated patient's ID
      patientId = req.user.id;
    }
    
    const patient = await Patient.findById(patientId)
      .select('formSubmissions')
      .populate('formSubmissions.doctorId', 'name email specialization');
    
    if (!patient) {
      return next(createError('Patient not found', 404));
    }
    
    res.status(200).json({
      success: true,
      count: patient.formSubmissions.length,
      data: patient.formSubmissions
    });
  } catch (error) {
    next(error);
  }
};

// Get a specific form submission
exports.getFormSubmission = async (req, res, next) => {
  try {
    let patientId;
    
    // If admin or doctor is requesting a specific patient's form
    if ((req.user.role === 'admin' || req.user.role === 'doctor') && req.params.id) {
      patientId = req.params.id;
    } else {
      // Otherwise use the authenticated patient's ID
      patientId = req.user.id;
    }
    
    const { formId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(formId)) {
      return next(createError('Invalid form ID', 400));
    }
    
    const patient = await Patient.findById(patientId)
      .populate('formSubmissions.doctorId', 'name email specialization');
    
    if (!patient) {
      return next(createError('Patient not found', 404));
    }
    
    // Find the specific form submission
    const formSubmission = patient.formSubmissions.id(formId);
    
    if (!formSubmission) {
      return next(createError('Form submission not found', 404));
    }
    
    res.status(200).json({
      success: true,
      data: formSubmission
    });
  } catch (error) {
    next(error);
  }
};

// Update a form submission
exports.updateFormSubmission = async (req, res, next) => {
  try {
    let patientId;
    
    // If admin or doctor is updating a specific patient's form
    if ((req.user.role === 'admin' || req.user.role === 'doctor') && req.params.id) {
      patientId = req.params.id;
    } else {
      // Otherwise use the authenticated patient's ID
      patientId = req.user.id;
    }
    
    const { formId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(formId)) {
      return next(createError('Invalid form ID', 400));
    }
    
    const patient = await Patient.findById(patientId);
    
    if (!patient) {
      return next(createError('Patient not found', 404));
    }
    
    // Find the specific form submission
    const formSubmission = patient.formSubmissions.id(formId);
    
    if (!formSubmission) {
      return next(createError('Form submission not found', 404));
    }
    
    // If patient is updating, only allow updates to problem field
    if (req.user.role === 'patient') {
      if (req.body.problem) {
        formSubmission.problem = req.body.problem;
      }
    } else {
      // Admin or doctor can update status and add notes
      if (req.body.status) {
        formSubmission.status = req.body.status;
      }
      
      if (req.body.doctorNotes) {
        formSubmission.doctorNotes = req.body.doctorNotes;
      }
    }
    
    await patient.save();
    
    res.status(200).json({
      success: true,
      message: 'Form submission updated successfully',
      data: formSubmission
    });
  } catch (error) {
    next(error);
  }
};

// Upload additional medical files to a form submission
exports.uploadMedicalFiles = async (req, res, next) => {
  try {
    const patientId = req.user.id;
    const { formId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(formId)) {
      // Delete uploaded files if validation fails
      fileService.deleteFiles(req.files);
      
      return next(createError('Invalid form ID', 400));
    }
    
    const patient = await Patient.findById(patientId);
    
    if (!patient) {
      // Delete uploaded files if patient not found
      fileService.deleteFiles(req.files);
      
      return next(createError('Patient not found', 404));
    }
    
    // Find the specific form submission
    const formSubmission = patient.formSubmissions.id(formId);
    
    if (!formSubmission) {
      // Delete uploaded files if form not found
      fileService.deleteFiles(req.files);
      
      return next(createError('Form submission not found', 404));
    }
    
    // Process uploaded files
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        formSubmission.medicalFiles.push({
          fileName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          uploadDate: new Date(),
          filePath: file.path
        });
      });
    } else {
      return next(createError('No files uploaded', 400));
    }
    
    await patient.save();
    
    res.status(200).json({
      success: true,
      message: 'Medical files uploaded successfully',
      data: {
        formSubmission
      }
    });
  } catch (error) {
    // Delete uploaded files if an error occurs
    fileService.deleteFiles(req.files);
    
    next(error);
  }
};

// Download a medical file
exports.downloadMedicalFile = async (req, res, next) => {
  try {
    let patientId;
    
    // If admin or doctor is downloading a specific patient's file
    if ((req.user.role === 'admin' || req.user.role === 'doctor') && req.params.id) {
      patientId = req.params.id;
    } else {
      // Otherwise use the authenticated patient's ID
      patientId = req.user.id;
    }
    
    const { formId, fileId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(formId) || !mongoose.Types.ObjectId.isValid(fileId)) {
      return next(createError('Invalid form or file ID', 400));
    }
    
    const patient = await Patient.findById(patientId);
    
    if (!patient) {
      return next(createError('Patient not found', 404));
    }
    
    // Find the specific form submission
    const formSubmission = patient.formSubmissions.id(formId);
    
    if (!formSubmission) {
      return next(createError('Form submission not found', 404));
    }
    
    // Find the specific file
    const file = formSubmission.medicalFiles.id(fileId);
    
    if (!file) {
      return next(createError('File not found', 404));
    }
    
    // Stream the file to response
    fileService.streamFileToResponse(res, file.filePath, file.fileName);
  } catch (error) {
    next(error);
  }
};

// Delete a medical file
exports.deleteMedicalFile = async (req, res, next) => {
  try {
    let patientId;
    
    // If admin is deleting a specific patient's file
    if (req.user.role === 'admin' && req.params.id) {
      patientId = req.params.id;
    } else {
      // Otherwise use the authenticated patient's ID
      patientId = req.user.id;
    }
    
    const { formId, fileId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(formId) || !mongoose.Types.ObjectId.isValid(fileId)) {
      return next(createError('Invalid form or file ID', 400));
    }
    
    const patient = await Patient.findById(patientId);
    
    if (!patient) {
      return next(createError('Patient not found', 404));
    }
    
    // Find the specific form submission
    const formSubmission = patient.formSubmissions.id(formId);
    
    if (!formSubmission) {
      return next(createError('Form submission not found', 404));
    }
    
    // Find the specific file
    const file = formSubmission.medicalFiles.id(fileId);
    
    if (!file) {
      return next(createError('File not found', 404));
    }
    
    // Delete the file from the filesystem
    fileService.deleteFileIfExists(file.filePath);
    
    // Remove the file from the database
    formSubmission.medicalFiles.pull(fileId);
    await patient.save();
    
    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get all patients (admin function)
exports.getAllPatients = async (req, res, next) => {
  try {
    // Only allow admins to access this endpoint
    if (req.user.role !== 'admin') {
      return next(createError('Not authorized to access this resource', 403));
    }
    
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