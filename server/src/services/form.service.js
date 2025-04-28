/**
 * Service for handling patient form submissions
 */
const Patient = require('../models/patient.model');
const mongoose = require('mongoose');
const { createError } = require('../utils/error.util');
const fileService = require('./file.service');

/**
 * Validate form data
 * @param {Object} formData - Form data to validate
 * @param {Array} files - Uploaded files
 * @throws {Error} If validation fails
 */
exports.validateFormData = (formData, files = []) => {
  const { doctorId, age, gender, phone, problem } = formData;
  
  // Validate required fields
  if (!doctorId || !age || !gender || !phone || !problem) {
    // Delete uploaded files if validation fails
    fileService.deleteFiles(files);
    
    throw createError('Missing required fields', 400);
  }
  
  // Validate age
  if (isNaN(age) || age <= 0 || age > 120) {
    // Delete uploaded files if validation fails
    fileService.deleteFiles(files);
    
    throw createError('Invalid age value', 400);
  }
  
  // Validate gender
  if (!['Male', 'Female', 'Other'].includes(gender)) {
    // Delete uploaded files if validation fails
    fileService.deleteFiles(files);
    
    throw createError('Invalid gender value', 400);
  }
  
  // Validate doctor ID
  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    // Delete uploaded files if validation fails
    fileService.deleteFiles(files);
    
    throw createError('Invalid doctor ID', 400);
  }
};

/**
 * Process uploaded medical files
 * @param {Array} files - Uploaded files
 * @returns {Array} Processed file objects
 */
exports.processUploadedFiles = (files) => {
  const medicalFiles = [];
  
  if (files && files.length > 0) {
    files.forEach(file => {
      medicalFiles.push({
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        uploadDate: new Date(),
        filePath: file.path
      });
    });
  }
  
  return medicalFiles;
};

/**
 * Submit a new form
 * @param {string} patientId - Patient ID
 * @param {Object} formData - Form data
 * @param {Array} medicalFiles - Processed medical files
 * @returns {Promise<Object>} Updated patient with new form
 */
exports.submitForm = async (patientId, formData, medicalFiles) => {
  const { doctorId, age, gender, phone, emergencyContact, problem } = formData;
  
  // Create form submission object
  const formSubmission = {
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
  
  // Add form submission to patient
  const patient = await Patient.findByIdAndUpdate(
    patientId,
    { $push: { formSubmissions: formSubmission } },
    { new: true }
  );
  
  if (!patient) {
    throw createError('Patient not found', 404);
  }
  
  // Get the newly added form submission (last one in the array)
  const newFormSubmission = patient.formSubmissions[patient.formSubmissions.length - 1];
  
  return newFormSubmission;
};

/**
 * Get all form submissions for a patient
 * @param {string} patientId - Patient ID
 * @returns {Promise<Array>} Form submissions
 */
exports.getFormSubmissions = async (patientId) => {
  const patient = await Patient.findById(patientId)
    .populate('formSubmissions.doctorId', 'name specialization photoURL');
  
  if (!patient) {
    throw createError('Patient not found', 404);
  }
  
  return patient.formSubmissions;
};

/**
 * Get a specific form submission
 * @param {string} patientId - Patient ID
 * @param {string} formId - Form submission ID
 * @returns {Promise<Object>} Form submission
 */
exports.getFormSubmission = async (patientId, formId) => {
  const patient = await Patient.findById(patientId)
    .populate('formSubmissions.doctorId', 'name specialization photoURL');
  
  if (!patient) {
    throw createError('Patient not found', 404);
  }
  
  const formSubmission = patient.formSubmissions.id(formId);
  
  if (!formSubmission) {
    throw createError('Form submission not found', 404);
  }
  
  return formSubmission;
};

/**
 * Update a form submission
 * @param {string} patientId - Patient ID
 * @param {string} formId - Form submission ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated form submission
 */
exports.updateFormSubmission = async (patientId, formId, updateData) => {
  // Don't allow status updates through this function (patient can't change status)
  if (updateData.status) {
    delete updateData.status;
  }
  
  const patient = await Patient.findById(patientId);
  
  if (!patient) {
    throw createError('Patient not found', 404);
  }
  
  const formSubmission = patient.formSubmissions.id(formId);
  
  if (!formSubmission) {
    throw createError('Form submission not found', 404);
  }
  
  // Update form submission fields
  Object.keys(updateData).forEach(key => {
    formSubmission[key] = updateData[key];
  });
  
  await patient.save();
  
  return formSubmission;
};