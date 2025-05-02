const Doctor = require('../models/doctor.model');
const Availability = require('../models/availability.model');
const PatientDetails = require('../models/patientDetails.model');
const fileService = require('../services/file.service');
const validationService = require('../services/validation.service');
const { createError } = require('../utils/error.util');

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

    // Get total count for pagination
    const total = await Doctor.countDocuments(query);

    const doctors = await Doctor.find(query)
      .select('name photoURL specialization degree experience')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.status(200).json({
      success: true,
      data: doctors,
      total,
      page: Number(page),
      limit: Number(limit)
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

// --- Create patient details ---
exports.createPatientDetails = async (req, res, next) => {
  try {
    const patientId = req.user.id;
    const { 
      doctorId, 
      fullName, 
      age, 
      relation, 
      contactNumber, 
      email, 
      gender, 
      emergencyContact, 
      problem 
    } = req.body;

    // Validate required fields
    if (!doctorId || !fullName || !age || !relation || !contactNumber || !email || !gender || !emergencyContact || !problem) {
      return next(createError('Missing required fields', 400));
    }

    // Validate doctor exists
    const doctorExists = await Doctor.exists({ _id: doctorId, isProfileComplete: true });
    if (!doctorExists) {
      return next(createError('Doctor not found or profile not complete', 404));
    }

    // Process uploaded files
    const medicalFiles = fileService.processUploadedFiles(req.files);

    // Create patient details
    const patientDetails = await PatientDetails.create({
      patientId,
      doctorId: req.body.doctorId,
      fullName: req.body.fullName,
      age: req.body.age,
      relation: req.body.relation,
      contactNumber: req.body.contactNumber,
      email: req.body.email,
      gender: req.body.gender,
      phone: req.body.contactNumber,
      emergencyContact: req.body.emergencyContact,
      problem: req.body.problem,
      medicalFiles: medicalFiles
    });

    await patientDetails.save();

    res.status(201).json({
      success: true,
      message: 'Form submitted successfully',
      data: {
        formSubmission: patientDetails
      }
    });
  } catch (error) {
    next(error);
  }
};

// --- Check appointment status ---
exports.checkAppointmentStatus = async (req, res, next) => {
  try {
    const patientId = req.user.id;
    const { submissionId } = req.params;
    
    // Validate submission ID
    validationService.validateObjectId(submissionId, 'submission');
    
    const submission = await PatientDetails.findOne({
      _id: submissionId,
      patientId
    });
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
        data: {
          status: 'not_found'
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        status: submission.status,
        appointmentDetails: submission.appointmentDetails || null,
        doctorResponse: submission.doctorResponse || null
      }
    });
  } catch (error) {
    next(error);
  }
};

// --- Request appointment ---
exports.requestAppointment = async (req, res, next) => {
  try {
    const patientId = req.user.id;
    const { submissionId } = req.params;
    const { date, time, notes } = req.body;
    
    // Validate submission ID
    validationService.validateObjectId(submissionId, 'submission');
    
    // Validate required fields
    if (!date || !time) {
      return next(createError('Date and time are required', 400));
    }
    
    const submission = await PatientDetails.findOne({
      _id: submissionId,
      patientId,
      status: 'opinion-needed'
    });
    
    if (!submission) {
      return next(createError('Submission not found or not eligible for appointment', 404));
    }
    
    // Update submission with appointment details
    submission.appointmentDetails = {
      date: new Date(date),
      time,
      notes: notes || ''
    };
    
    // Update status to pending approval
    submission.status = 'under-review';
    
    await submission.save();
    
    res.status(200).json({
      success: true,
      message: 'Appointment requested successfully',
      data: {
        status: submission.status,
        appointmentDetails: submission.appointmentDetails,
        doctorResponse: submission.doctorResponse
      }
    });
  } catch (error) {
    next(error);
  }
};