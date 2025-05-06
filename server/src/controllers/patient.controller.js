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

// --- PUBLIC: Get doctor reviews ---
exports.getDoctorReviewsPublic = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Validate doctor ID
    validationService.validateObjectId(doctorId, 'doctor');
    
    // Find doctor with completed profile
    const doctor = await Doctor.findOne({ 
      _id: doctorId,
      isProfileComplete: true 
    })
    .select('reviews averageRating')
    .populate({
      path: 'reviews.patientId',
      select: 'name photoURL'
    });
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found or profile not complete'
      });
    }
    
    // Helper to format "dayAgo"
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
    
    // Apply pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedReviews = sortedReviews.slice(startIndex, endIndex);
    
    // Format reviews for response
    const formattedReviews = paginatedReviews.map(review => ({
      id: review._id,
      patientName: review.patientId ? review.patientId.name : 'Anonymous',
      patientPhoto: review.patientId ? review.patientId.photoURL : null,
      rating: review.rating,
      comment: review.comment,
      dayAgo: getDayAgo(review.createdAt)
    }));
    
    res.status(200).json({
      success: true,
      data: {
        reviews: formattedReviews,
        averageRating: doctor.averageRating,
        totalReviews: doctor.reviews.length,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(doctor.reviews.length / Number(limit))
      }
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

// --- Get response status ---
exports.getResponse = async (req, res, next) => {
  try {
    const patientId = req.user.id;
    
    // Find the latest submission for this patient
    const submission = await PatientDetails.findOne({ patientId })
      .sort({ createdAt: -1 });

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
        id: submission._id,
        status: submission.status,
        doctorId: submission.doctorId,
        doctorResponse: submission.doctorResponse || null,
        appointmentDetails: submission.appointmentDetails || null
      }
    });
  } catch (error) {
    next(error);
  }
};

// --- Get available slots for a doctor on a specific date ---
exports.getAvailableSlots = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;
    
    // Validate required parameters
    if (!doctorId) {
      return next(createError('Doctor ID is required', 400));
    }
    
    if (!date) {
      return next(createError('Date is required', 400));
    }
    
    // Validate date format
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return next(createError('Invalid date format. Use YYYY-MM-DD', 400));
    }
    
    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dateObj < today) {
      return next(createError('Cannot check availability for past dates', 400));
    }
    
    // Find doctor's availability
    const availability = await Availability.findOne({ doctorId });
    if (!availability) {
      return next(createError('Doctor availability not found', 404));
    }
    
    // Get available slots
    const availableSlots = await availability.getAvailableSlots(date);
    
    // If the requested date is today, filter out slots that have already passed
    const isToday = dateObj.toDateString() === new Date().toDateString();
    let filteredSlots = availableSlots;
    
    if (isToday) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      filteredSlots = availableSlots.filter(slot => {
        const [slotHour, slotMinute] = slot.split(':').map(Number);
        // Compare slot time with current time
        return (slotHour > currentHour) || 
               (slotHour === currentHour && slotMinute > currentMinute);
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        date,
        availableSlots: filteredSlots
      }
    });
  } catch (error) {
    next(error);
  }
};

// --- Update the requestAppointment method to check availability ---
exports.requestAppointment = async (req, res, next) => {
  try {
    const patientId = req.user.id;
    const { responseId } = req.params;
    const { date, time, notes } = req.body;
    
    // Validate submission ID
    validationService.validateObjectId(responseId, 'submission');
    
    // Validate required fields
    if (!date || !time) {
      return next(createError('Date and time are required', 400));
    }
    
    const submission = await PatientDetails.findOne({
      _id: responseId,
      patientId,
      status: { $in: ['opinion-needed', 'rejected'] }
    });
    
    if (!submission) {
      return next(createError('Submission not found or not eligible for appointment', 404));
    }
    
    // Check if the selected slot is available
    const availability = await Availability.findOne({ doctorId: submission.doctorId });
    if (!availability) {
      return next(createError('Doctor availability not found', 404));
    }
    
    const isAvailable = await availability.isAvailable(new Date(date), time);
    if (!isAvailable) {
      return next(createError('The selected time slot is no longer available', 409));
    }
    
    // Update submission with appointment details
    submission.appointmentDetails = {
      date: new Date(date),
      time
    };
    
    // Update status to under-review
    submission.status = 'under-review';
    
    // Save the updated submission
    await submission.save();
    
    // Reserve the slot temporarily (mark as unavailable for 24 hours)
    await availability.reserveSlot(new Date(date), time);
    
    res.status(200).json({
      success: true,
      message: 'Appointment requested successfully',
      data: {
        appointmentDetails: submission.appointmentDetails,
        status: submission.status
      }
    });
  } catch (error) {
    next(error);
  }
};

// --- Submit a review for a doctor ---
// Submit review for a doctor
exports.submitReview = async (req, res, next) => {
  try {
    const { submissionId } = req.params;
    const patientId = req.user.id;
    const { rating, comment } = req.body;
    
    // Validate required fields
    if (!rating) {
      return next(createError('Rating is required', 400));
    }
    
    // Validate rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return next(createError('Rating must be between 1 and 5', 400));
    }
    
    // Find the submission
    const submission = await PatientDetails.findOne({ 
      _id: submissionId,
      patientId
    });
    
    if (!submission) {
      return next(createError('Submission not found', 404));
    }
    
    // Check if the submission status is approved or completed
    if (submission.status !== 'approved' && submission.status !== 'completed') {
      return next(createError('You can only review after your appointment has been approved or completed', 400));
    }
    
    // Check if the patient has already submitted a review for this submission
    if (submission.hasReview) {
      return next(createError('You have already submitted a review for this appointment', 400));
    }
    
    // Get the doctor ID from the submission
    const doctorId = submission.doctorId;
    
    // Add review to the doctor's reviews array
    const doctor = await Doctor.findById(doctorId);
    
    if (!doctor) {
      return next(createError('Doctor not found', 404));
    }
    
    // Add the review
    doctor.reviews.push({
      patientId,
      rating,
      comment: comment || '',
      createdAt: new Date()
    });
    
    // Calculate new average rating
    const totalRating = doctor.reviews.reduce((sum, review) => sum + review.rating, 0);
    doctor.averageRating = totalRating / doctor.reviews.length;
    
    // Save the doctor with the new review
    await doctor.save();
    
    // Mark the submission as having a review
    submission.hasReview = true;
    submission.review = {
      rating,
      comment: comment || ''
    };
    
    await submission.save();
    
    res.status(200).json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        rating,
        comment: comment || ''
      }
    });
  } catch (error) {
    next(error);
  }
};

// Add this new function to the existing file