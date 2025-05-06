const Doctor = require('../models/doctor.model');
const Availability = require('../models/availability.model');
const PatientDetails = require('../models/patientDetails.model');
const { createError } = require('../utils/error.util');
const fileService = require('../services/file.service');

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
    
    // Validate time format
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(req.body.startTime) || !timeRegex.test(req.body.endTime)) {
      return next(createError('Time format should be HH:MM (24-hour format)', 400));
    }
    
    // Validate that end time is after start time
    const [startHour, startMinute] = req.body.startTime.split(':').map(Number);
    const [endHour, endMinute] = req.body.endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    if (endMinutes <= startMinutes) {
      return next(createError('End time must be after start time', 400));
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
    
    // Generate time slots based on the availability settings
    await availability.generateTimeSlots();
    
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

// Change password for doctor
exports.changePassword = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    const isMatch = await doctor.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    doctor.password = newPassword;
    await doctor.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
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
    
    res.status(200).json({
      success: true,
      data: {
        todayAppointments,
        pendingAppointments,
        completedAppointments,
        totalPatients
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get doctor reviews
exports.getDoctorReviews = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 4;
    const skip = (page - 1) * limit;

    const doctor = await Doctor.findById(doctorId)
      .select('reviews averageRating')
      .populate({
        path: 'reviews.patientId',
        select: 'name photoURL'
      });

    if (!doctor) {
      return next(createError('Doctor not found', 404));
    }

    function getDayAgo(date) {
      const now = new Date();
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return '1 day ago';
      return `${diffDays} days ago`;
    }

    // Sort reviews by date (newest first)
    const sortedReviews = doctor.reviews
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Paginate reviews
    const paginatedReviews = sortedReviews.slice(skip, skip + limit).map(review => ({
      patientId: review.patientId._id,
      patientName: review.patientId.name,
      patientPhotoURL: review.patientId.photoURL,
      rating: review.rating,
      comment: review.comment,
      dayAgo: getDayAgo(review.createdAt)
    }));

    res.status(200).json({
      success: true,
      message: 'Doctor reviews retrieved successfully',
      data: {
        reviews: paginatedReviews,
        averageRating: doctor.averageRating,
        totalReviews: doctor.reviews.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all appointments for the doctor
exports.getAppointments = async (req, res, next) => {
  try {
    const { status, dateRange, page = 1, limit = 10 } = req.query;
    const doctorId = req.user.id;
    
    // Build query
    const query = { doctorId };
    
    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Filter by date range if provided
    if (dateRange) {
      try {
        // Parse the dateRange object
        const parsedDateRange = typeof dateRange === 'string' 
          ? JSON.parse(dateRange) 
          : dateRange;
        
        if (parsedDateRange.startDate && parsedDateRange.endDate) {
          const startDate = new Date(parsedDateRange.startDate);
          startDate.setHours(0, 0, 0, 0);
          
          const endDate = new Date(parsedDateRange.endDate);
          endDate.setHours(23, 59, 59, 999);
          
          query.submittedAt = { $gte: startDate, $lte: endDate };
        }
      } catch (error) {
        console.error('Error parsing date range:', error);
      }
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
      .sort({ submittedAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    
    // Format response to include required fields only
    const formattedAppointments = appointments.map(app => ({
      appointmentId: app._id,
      fullName: app.fullName,
      email: app.email || '',
      photoURL: app.patientId?.photoURL || '',
      status: app.status,
      submittedAt: app.submittedAt,
      appointmentTime: app.submittedAt.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
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
     .select('fullName age gender email status contactNumber emergencyContact patientId problem medicalFiles')
    
    if (!appointment) {
      return next(createError('Appointment not found', 404));
    }

    formattedAppointments = {
      appointmentId: appointment._id,
      fullName: appointment.fullName,
      age: appointment.age,
      gender: appointment.gender,
      email: appointment.email,
      status: appointment.status,
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
    const doctorId = req.user.id;
       
    // Check if the appointment exists and belongs to this doctor
    const appointment = await PatientDetails.findOne({
      _id: appointmentId,
      doctorId,
      status: 'pending' // Only allow responses to pending appointments
    });
    
    if (!appointment) {
      return next(createError('Appointment not found or not in pending status', 404));
    }
    
    // Get message and secondOpinionRequired from form data
    const { message, secondOpinionRequired } = req.body;
    
    if (!message) {
      return next(createError('Message is required', 400));
    }
    
    // Process response file if any
    let responseFiles = [];
    if (req.file) {
      // Process the file
      responseFiles.push({
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        uploadDate: new Date(),
        filePath: req.file.path
      });
    }
    
    // Update appointment with doctor's response
    const updatedAppointment = await PatientDetails.findByIdAndUpdate(
      appointmentId,
      {
        status: secondOpinionRequired === 'true' ? 'opinion-needed' : 'opinion-not-needed',
        doctorResponse: {
          message,
          responseDate: new Date(),
          secondOpinionRequired: secondOpinionRequired === 'true',
          responseFiles
        }
      },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Response submitted successfully',
      data: updatedAppointment
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
      status: 'under-review'
    };
    
    // Get total count for pagination
    const total = await PatientDetails.countDocuments(query);
    
    // Get requests with pagination
    const requests = await PatientDetails.find(query)
      .select('_id fullName patientId doctorId appointmentDetails.date appointmentDetails.time')
      .sort({ submittedAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    // Format response to include required fields only
    const formattedRequests = requests.map(req => {
      let appointmentDate = '';
      let appointmentTime = '';
      if (req.appointmentDetails && req.appointmentDetails.date) {
        const dateObj = req.appointmentDetails.date;
        appointmentDate = dateObj.toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
        // Format time as "hh:mm AM/PM"
        if (req.appointmentDetails.time) {
          appointmentTime = req.appointmentDetails.time;
        } else {
          appointmentTime = dateObj.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
        }
      }
      return {
        requestId: req._id,
        patientId: req.patientId,
        fullName: req.fullName,
        doctorId: req.doctorId,
        appointmentDate, // e.g., "12 Jan 2024"
        appointmentTime  // e.g., "10:30 AM"
      };
    });
    
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
    const doctorId = req.user.id;
    const { requestId } = req.params;
    
    // Validate request ID
    if (!requestId) {
      return next(createError('Request ID is required', 400));
    }
    
    // Find the patient request
    const patientRequest = await PatientDetails.findOne({
      _id: requestId,
      doctorId,
      status: 'under-review'
    });
    
    if (!patientRequest) {
      return next(createError('Patient request not found or not in review status', 404));
    }
    
    // Verify the appointment slot is still available
    const availability = await Availability.findOne({ doctorId });
    if (!availability) {
      return next(createError('Doctor availability not found', 404));
    }
    
    const appointmentDate = patientRequest.appointmentDetails.date;
    const appointmentTime = patientRequest.appointmentDetails.time;
    
    // Check for conflicting appointments (excluding this one)
    const conflictingAppointment = await PatientDetails.findOne({
      _id: { $ne: requestId },
      doctorId,
      status: 'approved',
      'appointmentDetails.date': {
        $gte: new Date(appointmentDate).setHours(0, 0, 0, 0),
        $lt: new Date(appointmentDate).setHours(23, 59, 59, 999)
      },
      'appointmentDetails.time': appointmentTime
    });
    
    if (conflictingAppointment) {
      return next(createError('This time slot is no longer available', 409));
    }
    
    // Update the request status to approved
    patientRequest.status = 'approved';
    await patientRequest.save();
    
    // Confirm the slot reservation permanently
    await availability.confirmSlot(appointmentDate, appointmentTime);
    
    res.status(200).json({
      success: true,
      message: 'Patient request approved successfully',
      data: patientRequest
    });
  } catch (error) {
    next(error);
  }
};

// Reject patient request
exports.rejectPatientRequest = async (req, res, next) => {
  try {
    const doctorId = req.user.id;
    const { requestId } = req.params;
    
    // Validate request ID
    if (!requestId) {
      return next(createError('Request ID is required', 400));
    }
    
    // Find the patient request
    const patientRequest = await PatientDetails.findOne({
      _id: requestId,
      doctorId,
      status: 'under-review'
    });
    
    if (!patientRequest) {
      return next(createError('Patient request not found or not in review status', 404));
    }
    
    // Update the request status to rejected
    patientRequest.status = 'rejected';
    
    await patientRequest.save();
    
    // Release the reserved slot
    const availability = await Availability.findOne({ doctorId });
    if (availability) {
      const appointmentDate = patientRequest.appointmentDetails.date;
      const appointmentTime = patientRequest.appointmentDetails.time;
      await availability.releaseSlot(appointmentDate, appointmentTime);
    }
    
    res.status(200).json({
      success: true,
      message: 'Patient request rejected successfully',
      data: patientRequest
    });
  } catch (error) {
    next(error);
  }
};