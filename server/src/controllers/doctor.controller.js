const Doctor = require('../models/doctor.model');
const Availability = require('../models/availability.model');
const PatientDetails = require('../models/patientDetails.model');
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

// Get dashboard statistics
exports.getDashboardStats = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Get counts for different appointment statuses
    const [
      todayAppointments,
      pendingAppointments,
      completedAppointments,
      totalPatients
    ] = await Promise.all([
      // Today's appointments
      PatientDetails.countDocuments({
        doctorId,
        status: 'approved',
        'appointmentDetails.date': {
          $gte: today,
          $lt: tomorrow
        }
      }),
      
      // Pending appointments (requests)
      PatientDetails.countDocuments({
        doctorId,
        status: 'pending'
      }),
      
      // Completed appointments
      PatientDetails.countDocuments({
        doctorId,
        status: 'completed'
      }),
      
      // Total unique patients
      PatientDetails.distinct('patientId', { doctorId }).then(ids => ids.length)
    ]);
    
    // Get recent activity (last 5 status changes)
    const recentActivity = await PatientDetails.find({ doctorId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('fullName status updatedAt')
      .populate('patientId', 'name');
    
    res.status(200).json({
      success: true,
      data: {
        todayAppointments,
        pendingAppointments,
        completedAppointments,
        totalPatients,
        recentActivity
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all appointments for the doctor
exports.getAppointments = async (req, res, next) => {
  try {
    const { status, date, page = 1, limit = 10 } = req.query;
    const doctorId = req.user.id;
    
    // Build query
    const query = { doctorId };
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    } else {
      // By default, show approved appointments
      query.status = 'approved';
    }
    
    // Filter by date if provided
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      query['appointmentDetails.date'] = { $gte: startDate, $lte: endDate };
    }
    
    // Get total count for pagination
    const total = await PatientDetails.countDocuments(query);
    
    // Get appointments with pagination and populate patient info
    const appointments = await PatientDetails.find(query)
      .select('_id fullName email status submittedAt patientId') // select only needed fields
      .populate({
        path: 'patientId',
        select: 'photoURL'
      })
      .sort({ 'appointmentDetails.date': 1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    
    // Format response to include required fields only
    const formattedAppointments = appointments.map(app => ({
      appointmentId: app._id,
      fullName: app.fullName,
      email: app.patientId?.email || '',
      photoURL: app.patientId?.photoURL || '',
      status: app.status,
      submittedAt: app.submittedAt
    }));

    res.status(200).json({
      success: true,
      data: formattedAppointments,
      total,
      page: Number(page),
      limit: Number(limit)
    });
  } catch (error) {
    next(error);
  }
};

// Get appointment details
exports.getAppointmentDetails = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const doctorId = req.user.id;
    
    const appointment = await PatientDetails.findOne({
      _id: appointmentId,
      doctorId
    })
     .select('fullName age gender email contactNumber emergencyContact patientId problem medicalFiles')
    
    if (!appointment) {
      return next(createError('Appointment not found', 404));
    }

    formattedAppointments = {
      appointmentId: appointment._id,
      fullName: appointment.fullName,
      age: appointment.age,
      gender: appointment.gender,
      email: appointment.email,
      contactNumber: appointment.contactNumber,
      emergencyContact: appointment.emergencyContact,
      problem: appointment.problem,
      medicalFiles: appointment.medicalFiles,
      patientId: appointment.patientId
    }
    
    res.status(200).json({
      success: true,
      data: formattedAppointments
    });
  } catch (error) {
    next(error);
  }
};

// Submit response to patient appointment
exports.submitAppointmentResponse = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const { message, secondOpinionRequired } = req.body;
    const doctorId = req.user.id;
    
    if (!message) {
      return next(createError('Response message is required', 400));
    }
    
    // Process uploaded files if any
    let responseFiles = [];
    if (req.files && req.files.length > 0) {
      responseFiles = fileService.processUploadedFiles(req.files);
    }
    
    const updateData = {
      doctorResponse: {
        message,
        responseDate: new Date(),
        responseFiles,
        secondOpinionRequired: secondOpinionRequired === 'yes'
      }
    };
    
    // Update status based on second opinion requirement
    if (secondOpinionRequired === 'yes') {
      updateData.status = 'opinion-needed';
    } else if (secondOpinionRequired === 'no') {
      updateData.status = 'opinion-not-needed';
    }
    
    const appointment = await PatientDetails.findOneAndUpdate(
      { _id: appointmentId, doctorId },
      updateData,
      { new: true }
    );
    
    if (!appointment) {
      return next(createError('Appointment not found', 404));
    }
    
    res.status(200).json({
      success: true,
      message: 'Response submitted successfully',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// Get patient requests
exports.getPatientRequests = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const doctorId = req.user.id;
    
    // Get requests with opinion-needed status
    const query = { 
      doctorId,
      status: 'opinion-needed'
    };
    
    // Get total count for pagination
    const total = await PatientDetails.countDocuments(query);
    
    // Get requests with pagination
    const requests = await PatientDetails.find(query)
      .select('fullName appointmentDetails.date')
      .sort({ submittedAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    // Format response to include required fields only
    const formattedRequests = requests.map(req => ({
      requestId: req._id,
      fullName: req.fullName,
      appointmentDate: req.formattedAppointmentDate // e.g., "12 Jan 2023 at 10:00 AM"
    }));
    
    res.status(200).json({
      success: true,
      data: formattedRequests,
      total,
      page: Number(page),
      limit: Number(limit)
    });
  } catch (error) {
    next(error);
  }
};

// Accept patient request
exports.acceptPatientRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const doctorId = req.user.id;
    
    
    const request = await PatientDetails.findOneAndUpdate(
      { _id: requestId, doctorId, status: 'opinion-needed' },
      {
        status: 'approved'
      },
      { new: true }
    );
    
    if (!request) {
      return next(createError('Request not found or already processed', 404));
    }
    
    res.status(200).json({
      success: true,
      message: 'Request accepted successfully',
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// Reject patient request
exports.rejectPatientRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const doctorId = req.user.id;
    
    const request = await PatientDetails.findOneAndUpdate(
      { _id: requestId, doctorId, status: 'opinion-needed' },
      {
        status: 'rejected'
      },
      { new: true }
    );
    
    if (!request) {
      return next(createError('Request not found or already processed', 404));
    }
    
    res.status(200).json({
      success: true,
      message: 'Request rejected successfully',
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// Get doctor reviews
exports.getDoctorReviews = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    
    const doctor = await Doctor.findById(doctorId)
      .select('reviews averageRating')
      .populate({
        path: 'reviews.patientId',
        select: 'name photoURL'
      });
    
    if (!doctor) {
      return next(createError('Doctor not found', 404));
    }
    
    // Sort reviews by date (newest first)
    const sortedReviews = doctor.reviews.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    res.status(200).json({
      success: true,
      message: 'Doctor reviews retrieved successfully',
      data: {
        reviews: sortedReviews,
        averageRating: doctor.averageRating,
        totalReviews: doctor.reviews.length
      }
    });
  } catch (error) {
    next(error);
  }
};