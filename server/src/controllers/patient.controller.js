const Patient = require('../models/patient.model');
const Doctor = require('../models/doctor.model');
const Availability = require('../models/availability.model');
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
      .select('name photoURL specialization degree experience')
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

// --- PUBLIC: Get doctor by ID ---
exports.getDoctorByIdPublic = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    
    // Validate doctor ID
    validationService.validateObjectId(doctorId, 'doctor');
    
    // Find doctor with completed profile and populate availability in a single query
    const doctor = await Doctor.findOne({ 
      _id: doctorId,
      isProfileComplete: true 
    })
    .select(
      '_id name email specialization experience degree hospitalAffiliation ' +
      'hospitalAddress licenseNumber issuingMedicalCouncil consultationFee ' + 
      'languages location photoURL gender bio timezone'
    )
    .populate({
      path: 'availability',
      select: 'workingDays startTime endTime weeklyHoliday timeSlots'
    })
    .lean();
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found or profile not complete'
      });
    }
    
    // If availability isn't found through populate, try to find it directly
    // This is a fallback for doctors created before the schema update
    if (!doctor.availability) {
      const availability = await Availability.findOne({ doctorId: doctor._id }).lean();
      
      if (availability) {
        doctor.availability = {
          workingDays: availability.workingDays,
          startTime: availability.startTime,
          endTime: availability.endTime,
          weeklyHoliday: availability.weeklyHoliday,
          timeSlots: availability.timeSlots
        };
      }
    }
    
    res.status(200).json({
      success: true,
      data: doctor
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