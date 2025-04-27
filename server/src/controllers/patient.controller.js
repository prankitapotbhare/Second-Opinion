const Patient = require('../models/patient.model');
const { createError } = require('../utils/error.util');
const userService = require('../services/user.service');
const fileService = require('../services/file.service');
const formService = require('../services/form.service');
const responseService = require('../services/response.service');
const validationService = require('../services/validation.service');

// Get patient profile (using authenticated user)
exports.getPatientProfile = async (req, res, next) => {
  try {
    const patient = await userService.getUserProfile(Patient, req.user.id);
    responseService.sendSuccess(res, 'Patient profile retrieved successfully', patient);
  } catch (error) {
    next(error);
  }
};

// Update patient profile (using authenticated user)
exports.updatePatientProfile = async (req, res, next) => {
  try {
    const patient = await userService.updateUserProfile(Patient, req.user.id, req.body);
    responseService.sendSuccess(res, 'Patient profile updated successfully', patient);
  } catch (error) {
    next(error);
  }
};

// Get patient details (for admin or doctor viewing a specific patient)
exports.getPatientDetails = async (req, res, next) => {
  try {
    validationService.validateObjectId(req.params.id, 'patient');
    const patient = await userService.getUserDetails(Patient, req.params.id);
    responseService.sendSuccess(res, 'Patient details retrieved successfully', patient);
  } catch (error) {
    next(error);
  }
};

// Create new patient (admin function)
exports.createPatient = async (req, res, next) => {
  try {
    // Validate required fields
    validationService.validateRequiredFields(req.body, ['name', 'email', 'password']);
    
    // Validate email format
    validationService.validateEmail(req.body.email);
    
    const patientResponse = await userService.createUser(Patient, req.body);
    responseService.sendSuccess(res, 'Patient created successfully', patientResponse, 201);
  } catch (error) {
    next(error);
  }
};

// Update patient details (admin function)
exports.updatePatient = async (req, res, next) => {
  try {
    validationService.validateObjectId(req.params.id, 'patient');
    const patient = await userService.updateUser(Patient, req.params.id, req.body);
    responseService.sendSuccess(res, 'Patient profile updated successfully', patient);
  } catch (error) {
    next(error);
  }
};

// Submit a form (using authenticated user)
exports.submitForm = async (req, res, next) => {
  try {
    const patientId = req.user.id;
    
    // Validate form data
    formService.validateFormData(req.body, req.files);
    
    // Process uploaded files
    const medicalFiles = formService.processUploadedFiles(req.files);
    
    // Submit form
    const formSubmission = await formService.submitForm(patientId, req.body, medicalFiles);
    
    responseService.sendSuccess(res, 'Form submitted successfully', formSubmission, 201);
  } catch (error) {
    next(error);
  }
};

// Get all form submissions for a patient (using authenticated user)
exports.getFormSubmissions = async (req, res, next) => {
  try {
    const patientId = req.user.id;
    const formSubmissions = await formService.getFormSubmissions(patientId);
    responseService.sendSuccess(res, 'Form submissions retrieved successfully', formSubmissions);
  } catch (error) {
    next(error);
  }
};

// Get a specific form submission (using authenticated user)
exports.getFormSubmission = async (req, res, next) => {
  try {
    const patientId = req.user.id;
    validationService.validateObjectId(req.params.formId, 'form');
    
    const formSubmission = await formService.getFormSubmission(patientId, req.params.formId);
    responseService.sendSuccess(res, 'Form submission retrieved successfully', formSubmission);
  } catch (error) {
    next(error);
  }
};

// Update a form submission (using authenticated user)
exports.updateFormSubmission = async (req, res, next) => {
  try {
    const patientId = req.user.id;
    validationService.validateObjectId(req.params.formId, 'form');
    
    const formSubmission = await formService.updateFormSubmission(patientId, req.params.formId, req.body);
    responseService.sendSuccess(res, 'Form submission updated successfully', formSubmission);
  } catch (error) {
    next(error);
  }
};

// Upload medical files to an existing form submission
exports.uploadMedicalFiles = async (req, res, next) => {
  try {
    const patientId = req.user.id;
    validationService.validateObjectId(req.params.formId, 'form');
    
    // Process uploaded files
    const newFiles = formService.processUploadedFiles(req.files);
    
    // Get the patient
    const patient = await Patient.findById(patientId);
    if (!patient) {
      // Delete uploaded files if patient not found
      fileService.deleteFiles(req.files);
      throw createError('Patient not found', 404);
    }
    
    // Get the form submission
    const formSubmission = patient.formSubmissions.id(req.params.formId);
    if (!formSubmission) {
      // Delete uploaded files if form not found
      fileService.deleteFiles(req.files);
      throw createError('Form submission not found', 404);
    }
    
    // Add new files to the form submission
    formSubmission.medicalFiles.push(...newFiles);
    await patient.save();
    
    responseService.sendSuccess(res, 'Medical files uploaded successfully', formSubmission);
  } catch (error) {
    next(error);
  }
};

// Download a medical file
exports.downloadMedicalFile = async (req, res, next) => {
  try {
    const patientId = req.user.id;
    validationService.validateObjectId(req.params.formId, 'form');
    validationService.validateObjectId(req.params.fileId, 'file');
    
    // Get the patient
    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw createError('Patient not found', 404);
    }
    
    // Get the form submission
    const formSubmission = patient.formSubmissions.id(req.params.formId);
    if (!formSubmission) {
      throw createError('Form submission not found', 404);
    }
    
    // Find the specific file
    const file = formSubmission.medicalFiles.id(req.params.fileId);
    if (!file) {
      throw createError('File not found', 404);
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
    const patientId = req.user.id;
    validationService.validateObjectId(req.params.formId, 'form');
    validationService.validateObjectId(req.params.fileId, 'file');
    
    // Get the patient
    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw createError('Patient not found', 404);
    }
    
    // Get the form submission
    const formSubmission = patient.formSubmissions.id(req.params.formId);
    if (!formSubmission) {
      throw createError('Form submission not found', 404);
    }
    
    // Find the specific file
    const file = formSubmission.medicalFiles.id(req.params.fileId);
    if (!file) {
      throw createError('File not found', 404);
    }
    
    // Delete the file from the filesystem
    fileService.deleteFileIfExists(file.filePath);
    
    // Remove the file from the database
    formSubmission.medicalFiles.pull(req.params.fileId);
    await patient.save();
    
    responseService.sendSuccess(res, 'File deleted successfully');
  } catch (error) {
    next(error);
  }
};

// Get all patients (admin function)
exports.getAllPatients = async (req, res, next) => {
  try {
    // Only allow admins to access this endpoint
    if (req.user.role !== 'admin') {
      return responseService.sendForbidden(res, 'Not authorized to access this resource');
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await userService.getAllUsers(Patient, {}, page, limit);
    
    responseService.sendPaginated(
      res, 
      'Patients retrieved successfully', 
      result.users, 
      result.page, 
      result.limit, 
      result.total
    );
  } catch (error) {
    next(error);
  }
};

// Delete patient (admin function)
exports.deletePatient = async (req, res, next) => {
  try {
    // Only allow admins to access this endpoint
    if (req.user.role !== 'admin') {
      return responseService.sendForbidden(res, 'Not authorized to access this resource');
    }
    
    validationService.validateObjectId(req.params.id, 'patient');
    
    await userService.deleteUser(Patient, req.params.id);
    responseService.sendSuccess(res, 'Patient deleted successfully');
  } catch (error) {
    next(error);
  }
};