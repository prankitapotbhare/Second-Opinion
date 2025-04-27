const Doctor = require('../models/doctor.model');
const Availability = require('../models/availability.model');
const fs = require('fs');
const path = require('path');
const { UPLOADS_DIR } = require('../utils/constants');
const responseUtil = require('../utils/response.util');
const multer = require('multer');
const { createError } = require('../utils/error.util');

// Configure multer for file uploads
const DOCTOR_FILES_DIR = path.join(UPLOADS_DIR, 'doctor_files');

// Ensure doctor files directory exists
if (!fs.existsSync(DOCTOR_FILES_DIR)) {
  fs.mkdirSync(DOCTOR_FILES_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, DOCTOR_FILES_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only pdf, jpg, jpeg, png
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file format. Only PDF, JPG, JPEG, and PNG are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Get doctor details
exports.getDoctorDetails = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('-password');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    // Get availability information
    const availability = await Availability.findOne({ doctorId: doctor._id });
    
    res.status(200).json({
      success: true,
      data: {
        doctor,
        availability: availability || null
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create new doctor
exports.createDoctor = async (req, res, next) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    
    // Remove password from response
    const doctorResponse = doctor.toObject();
    delete doctorResponse.password;
    
    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: doctorResponse
    });
  } catch (error) {
    next(error);
  }
};

// Update doctor details
exports.updateDoctor = async (req, res, next) => {
  try {
    // Don't allow password updates through this endpoint
    if (req.body.password) {
      delete req.body.password;
    }
    
    // Ensure the doctor can only update their own profile
    if (req.params.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this doctor profile'
      });
    }
    
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
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

// Complete doctor profile
exports.completeProfile = async (req, res, next) => {
  try {
    // Ensure the doctor can only update their own profile
    if (req.params.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this doctor profile'
      });
    }
    
    const {
      specialization,
      experience,
      hospitalAffiliation,
      hospitalAddress,
      licenseNumber,
      issuingMedicalCouncil,
      languages,
      phone,
      emergencyContact,
      consultationFee,
      consultationAddress,
      location,
      bio
    } = req.body;
    
    // Validate required fields
    if (!specialization || !experience || !hospitalAffiliation || !licenseNumber) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        details: {
          specialization: !specialization ? 'Specialization is required' : null,
          experience: !experience ? 'Experience is required' : null,
          hospitalAffiliation: !hospitalAffiliation ? 'Hospital affiliation is required' : null,
          licenseNumber: !licenseNumber ? 'License number is required' : null
        }
      });
    }
    
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    
    // Update doctor profile
    doctor.specialization = specialization;
    doctor.experience = experience;
    doctor.hospitalAffiliation = hospitalAffiliation;
    doctor.hospitalAddress = hospitalAddress;
    doctor.licenseNumber = licenseNumber;
    doctor.issuingMedicalCouncil = issuingMedicalCouncil;
    doctor.languages = languages || [];
    doctor.phone = phone;
    doctor.emergencyContact = emergencyContact;
    doctor.consultationFee = consultationFee;
    doctor.consultationAddress = consultationAddress;
    doctor.location = location;
    doctor.bio = bio;
    doctor.profileCompleted = true;
    
    await doctor.save();
    
    res.status(200).json({
      success: true,
      message: 'Doctor profile completed successfully',
      data: {
        doctor: {
          id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          specialization: doctor.specialization,
          profileCompleted: doctor.profileCompleted
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Upload doctor documents
exports.uploadDocuments = async (req, res, next) => {
  const uploadMiddleware = upload.fields([
    { name: 'registrationCertificate', maxCount: 1 },
    { name: 'governmentId', maxCount: 1 }
  ]);
  
  uploadMiddleware(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`
      });
    } else if (err) {
      // An unknown error occurred
      return res.status(500).json({
        success: false,
        message: `Server error: ${err.message}`
      });
    }
    
    try {
      // Ensure the doctor can only update their own profile
      if (req.params.id !== req.user.id && req.user.role !== 'admin') {
        // Delete uploaded files if unauthorized
        if (req.files) {
          Object.keys(req.files).forEach(key => {
            req.files[key].forEach(file => {
              fs.unlinkSync(file.path);
            });
          });
        }
        
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to upload documents for this doctor'
        });
      }
      
      const doctor = await Doctor.findById(req.params.id);
      
      if (!doctor) {
        // Delete uploaded files if doctor not found
        if (req.files) {
          Object.keys(req.files).forEach(key => {
            req.files[key].forEach(file => {
              fs.unlinkSync(file.path);
            });
          });
        }
        
        return res.status(404).json({ success: false, message: 'Doctor not found' });
      }
      
      // Process registration certificate
      if (req.files.registrationCertificate) {
        const file = req.files.registrationCertificate[0];
        
        // Delete old file if exists
        if (doctor.registrationCertificate && doctor.registrationCertificate.filePath) {
          if (fs.existsSync(doctor.registrationCertificate.filePath)) {
            fs.unlinkSync(doctor.registrationCertificate.filePath);
          }
        }
        
        doctor.registrationCertificate = {
          fileName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          uploadDate: new Date(),
          filePath: file.path
        };
      }
      
      // Process government ID
      if (req.files.governmentId) {
        const file = req.files.governmentId[0];
        
        // Delete old file if exists
        if (doctor.governmentId && doctor.governmentId.filePath) {
          if (fs.existsSync(doctor.governmentId.filePath)) {
            fs.unlinkSync(doctor.governmentId.filePath);
          }
        }
        
        doctor.governmentId = {
          fileName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          uploadDate: new Date(),
          filePath: file.path
        };
      }
      
      await doctor.save();
      
      res.status(200).json({
        success: true,
        message: 'Documents uploaded successfully',
        data: {
          registrationCertificate: doctor.registrationCertificate ? {
            fileName: doctor.registrationCertificate.fileName,
            uploadDate: doctor.registrationCertificate.uploadDate
          } : null,
          governmentId: doctor.governmentId ? {
            fileName: doctor.governmentId.fileName,
            uploadDate: doctor.governmentId.uploadDate
          } : null
        }
      });
    } catch (error) {
      // Delete uploaded files if an error occurs
      if (req.files) {
        Object.keys(req.files).forEach(key => {
          req.files[key].forEach(file => {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          });
        });
      }
      
      next(error);
    }
  });
};

// Get all doctors
exports.getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find().select('-password -registrationCertificate -governmentId');
    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    next(error);
  }
};

// Set doctor availability
exports.setAvailability = async (req, res, next) => {
  try {
    // Ensure the doctor can only update their own availability
    if (req.params.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this doctor\'s availability'
      });
    }
    
    const {
      workingDays,
      startTime,
      endTime,
      weeklyHoliday,
      timeSlots
    } = req.body;
    
    // Find existing availability or create new one
    let availability = await Availability.findOne({ doctorId: req.params.id });
    
    if (!availability) {
      availability = new Availability({
        doctorId: req.params.id
      });
    }
    
    // Update availability fields if provided
    if (workingDays) availability.workingDays = workingDays;
    if (startTime) availability.startTime = startTime;
    if (endTime) availability.endTime = endTime;
    if (weeklyHoliday) availability.weeklyHoliday = weeklyHoliday;
    if (timeSlots) availability.timeSlots = timeSlots;
    
    await availability.save();
    
    res.status(200).json({
      success: true,
      message: 'Availability updated successfully',
      data: availability
    });
  } catch (error) {
    next(error);
  }
};

// Get doctor availability
exports.getAvailability = async (req, res, next) => {
  try {
    const availability = await Availability.findOne({ doctorId: req.params.id });
    
    if (!availability) {
      return res.status(404).json({
        success: false,
        message: 'Availability not found for this doctor'
      });
    }
    
    res.status(200).json({
      success: true,
      data: availability
    });
  } catch (error) {
    next(error);
  }
};

// Download doctor document
exports.downloadDocument = async (req, res, next) => {
  try {
    const { id, documentType } = req.params;
    
    if (!['registrationCertificate', 'governmentId'].includes(documentType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid document type'
      });
    }
    
    const doctor = await Doctor.findById(id);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    const document = doctor[documentType];
    
    if (!document || !document.filePath) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    if (!fs.existsSync(document.filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Document file not found on server'
      });
    }
    
    res.download(document.filePath, document.fileName);
  } catch (error) {
    next(error);
  }
};