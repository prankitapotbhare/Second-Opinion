const Patient = require('../models/patient.model');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Get patient details
exports.getPatientDetails = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).select('-password');
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new patient
exports.createPatient = async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    
    // Remove password from response
    const patientResponse = patient.toObject();
    delete patientResponse.password;
    
    res.status(201).json(patientResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update patient details
exports.updatePatient = async (req, res) => {
  try {
    // Don't allow password updates through this endpoint
    if (req.body.password) {
      delete req.body.password;
    }
    
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Submit a new form
exports.submitForm = async (req, res) => {
  try {
    const { doctorId, age, gender, phone, emergencyContact, problem } = req.body;
    
    // Validate required fields
    if (!doctorId || !age || !gender || !phone || !problem) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields',
        details: {
          doctorId: !doctorId ? 'Doctor ID is required' : null,
          age: !age ? 'Age is required' : null,
          gender: !gender ? 'Gender is required' : null,
          phone: !phone ? 'Phone number is required' : null,
          problem: !problem ? 'Problem description is required' : null
        }
      });
    }
    
    // Validate age
    if (isNaN(age) || age <= 0 || age > 120) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid age value' 
      });
    }
    
    // Validate gender
    if (!['Male', 'Female', 'Other'].includes(gender)) {
      return res.status(400).json({ 
        success: false,
        message: 'Gender must be Male, Female, or Other' 
      });
    }
    
    // Ensure doctorId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid doctor ID' 
      });
    }
    
    // Ensure patient ID matches authenticated user or user has admin role
    if (req.params.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'You are not authorized to submit forms for this patient' 
      });
    }
    
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ 
        success: false,
        message: 'Patient not found' 
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
      medicalFiles: [],
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
    console.error('Form submission error:', error);
    res.status(500).json({ 
      success: false,
      message: 'An error occurred while submitting the form',
      error: error.message
    });
  }
};

// Get all form submissions for a patient
exports.getFormSubmissions = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .select('formSubmissions')
      .populate({
        path: 'formSubmissions.doctorId',
        select: 'name specialization'
      });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json({
      success: true,
      data: {
        formSubmissions: patient.formSubmissions
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific form submission
exports.getFormSubmission = async (req, res) => {
  try {
    const { id, formId } = req.params;
    
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    const formSubmission = patient.formSubmissions.id(formId);
    if (!formSubmission) {
      return res.status(404).json({ message: 'Form submission not found' });
    }
    
    res.json({
      success: true,
      data: {
        formSubmission
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload medical file to a specific form submission
exports.uploadMedicalFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No file uploaded' 
      });
    }

    const { id, formId } = req.params;
    
    // Ensure patient ID matches authenticated user or user has appropriate role
    if (id !== req.user.id && !['admin', 'doctor'].includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: 'You are not authorized to upload files for this patient' 
      });
    }
    
    const patient = await Patient.findById(id);
    if (!patient) {
      // Delete the uploaded file if patient not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ 
        success: false,
        message: 'Patient not found' 
      });
    }
    
    const formSubmission = patient.formSubmissions.id(formId);
    if (!formSubmission) {
      // Delete the uploaded file if form submission not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ 
        success: false,
        message: 'Form submission not found' 
      });
    }

    const fileInfo = {
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadDate: new Date(),
      filePath: req.file.path
    };

    formSubmission.medicalFiles.push(fileInfo);
    await patient.save();

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        file: fileInfo
      }
    });
  } catch (error) {
    // Delete the uploaded file if an error occurs
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    console.error('File upload error:', error);
    res.status(500).json({ 
      success: false,
      message: 'An error occurred while uploading the file',
      error: error.message
    });
  }
};

// Add a new method to update a form submission
exports.updateFormSubmission = async (req, res) => {
  try {
    const { id, formId } = req.params;
    const { status, problem } = req.body;
    
    // Ensure patient ID matches authenticated user or user has admin role
    if (id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'You are not authorized to update forms for this patient' 
      });
    }
    
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ 
        success: false,
        message: 'Patient not found' 
      });
    }
    
    const formSubmission = patient.formSubmissions.id(formId);
    if (!formSubmission) {
      return res.status(404).json({ 
        success: false,
        message: 'Form submission not found' 
      });
    }
    
    // Only allow updating certain fields
    if (problem) formSubmission.problem = problem;
    
    // Only allow doctors or admins to update status
    if (status && ['doctor', 'admin'].includes(req.user.role)) {
      if (!['pending', 'in-review', 'completed', 'rejected'].includes(status)) {
        return res.status(400).json({ 
          success: false,
          message: 'Invalid status value' 
        });
      }
      formSubmission.status = status;
    }
    
    await patient.save();
    
    res.json({
      success: true,
      message: 'Form submission updated successfully',
      data: {
        formSubmission
      }
    });
  } catch (error) {
    console.error('Form update error:', error);
    res.status(500).json({ 
      success: false,
      message: 'An error occurred while updating the form',
      error: error.message
    });
  }
};

// Add a method to delete a medical file
exports.deleteMedicalFile = async (req, res) => {
  try {
    const { id, formId, fileId } = req.params;
    
    // Ensure patient ID matches authenticated user or user has admin role
    if (id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'You are not authorized to delete files for this patient' 
      });
    }
    
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ 
        success: false,
        message: 'Patient not found' 
      });
    }
    
    const formSubmission = patient.formSubmissions.id(formId);
    if (!formSubmission) {
      return res.status(404).json({ 
        success: false,
        message: 'Form submission not found' 
      });
    }
    
    const file = formSubmission.medicalFiles.id(fileId);
    if (!file) {
      return res.status(404).json({ 
        success: false,
        message: 'File not found' 
      });
    }
    
    // Delete the file from the filesystem
    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }
    
    // Remove the file from the formSubmission
    formSubmission.medicalFiles.pull(fileId);
    await patient.save();
    
    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({ 
      success: false,
      message: 'An error occurred while deleting the file',
      error: error.message
    });
  }
};

// Download medical file from a specific form submission
exports.downloadMedicalFile = async (req, res) => {
  try {
    const { id, formId, fileId } = req.params;
    
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    const formSubmission = patient.formSubmissions.id(formId);
    if (!formSubmission) {
      return res.status(404).json({ message: 'Form submission not found' });
    }
    
    const file = formSubmission.medicalFiles.id(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (!fs.existsSync(file.filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    res.download(file.filePath, file.fileName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};