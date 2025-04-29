const Patient = require('../models/patient.model');
const Doctor = require('../models/doctor.model');
const fileService = require('../services/file.service');
const formService = require('../services/form.service');
const validationService = require('../services/validation.service');

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

// Submit a form (using authenticated user)
exports.submitForm = async (req, res, next) => {
  try {
    const patientId = req.user.id;
    
    // Validate form data
    formService.validateFormData(req.body, req.files);
    
    // Process uploaded files
    const medicalFiles = fileService.processUploadedFiles(req.files);
    
    // Submit form
    const formSubmission = await formService.submitForm(patientId, req.body, medicalFiles);
    
    res.status(201).json({
      success: true,
      message: 'Form submitted successfully',
      data: formSubmission
    });
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
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    // Get the form submission
    const formSubmission = patient.formSubmissions.id(req.params.formId);
    if (!formSubmission) {
      return res.status(404).json({
        success: false,
        message: 'Form submission not found'
      });
    }
    
    // Find the specific file
    const file = formSubmission.medicalFiles.id(req.params.fileId);
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    // Stream the file to response
    fileService.streamFileToResponse(res, file.filePath, file.fileName);
  } catch (error) {
    next(error);
  }
};