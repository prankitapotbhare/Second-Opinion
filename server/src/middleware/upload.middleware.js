/**
 * File upload middleware configurations
 */
const multer = require('multer');
const path = require('path');
const { 
  ALLOWED_FILE_TYPES, 
  ALLOWED_DOCUMENT_TYPES, 
  FILE_SIZE_LIMITS 
} = require('../utils/constants');
const cloudinaryService = require('../services/cloudinary.service');

// Configure multer to use memory storage instead of disk storage
const storage = multer.memoryStorage();

/**
 * File filter for medical files
 */
const medicalFileFilter = (req, file, cb) => {
  if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`), false);
  }
};

/**
 * File filter for doctor documents
 */
const doctorDocumentFilter = (req, file, cb) => {
  if (ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type. Allowed types: ${ALLOWED_DOCUMENT_TYPES.join(', ')}`), false);
  }
};

/**
 * Multer configuration for patient medical files
 */
exports.patientFileUpload = multer({
  storage: storage,
  limits: {
    fileSize: FILE_SIZE_LIMITS.MEDICAL_FILE
  },
  fileFilter: medicalFileFilter
});

/**
 * Multer configuration for doctor documents
 */
exports.doctorFileUpload = multer({
  storage: storage,
  limits: {
    fileSize: FILE_SIZE_LIMITS.DOCTOR_DOCUMENT
  },
  fileFilter: doctorDocumentFilter
});

/**
 * Handle multer errors
 */
exports.handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`
    });
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next();
};

/**
 * Upload files to Cloudinary middleware
 */
exports.uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.files && !req.file) return next();
    
    // Process single file
    if (req.file) {
      const fileBuffer = req.file.buffer;
      const fileType = req.file.mimetype;
      const originalName = req.file.originalname;

      // Create a data URI from the buffer
      const dataUri = `data:${fileType};base64,${fileBuffer.toString('base64')}`;

      // Determine folder based on user role
      const folder = req.user.role === 'doctor' 
        ? `second-opinion/doctor_files/${req.user.id}/responseFile`
        : `second-opinion/medical_files/${req.user.id}`;

      // Upload to Cloudinary with original filename
      const result = await cloudinaryService.uploadFile(dataUri, {
        folder,
        resource_type: 'auto',
        public_id: path.parse(originalName).name // Use original filename without extension
      });
      
      // Replace file properties with Cloudinary data
      req.file.path = result.secure_url;
      req.file.cloudinaryId = result.public_id;
      req.file.urlPath = result.secure_url;
    }
    
    // Process multiple files
    if (req.files) {
      // Handle array of files
      if (Array.isArray(req.files)) {
        for (const file of req.files) {
          const fileBuffer = file.buffer;
          const fileType = file.mimetype;
          const originalName = file.originalname;

          const dataUri = `data:${fileType};base64,${fileBuffer.toString('base64')}`;
          const folder = req.user.role === 'doctor' 
            ? `second-opinion/doctor_files/${req.user.id}`
            : `second-opinion/medical_files/${req.user.id}`;

          const result = await cloudinaryService.uploadFile(dataUri, {
            folder,
            resource_type: 'auto',
            public_id: path.parse(originalName).name
          });

          file.path = result.secure_url;
          file.cloudinaryId = result.public_id;
          file.urlPath = result.secure_url;
        }
      } 
      // Handle files object (for fields)
      else {
        for (const fieldname of Object.keys(req.files)) {
          for (const file of req.files[fieldname]) {
            const fileBuffer = file.buffer;
            const fileType = file.mimetype;
            const originalName = file.originalname;

            const dataUri = `data:${fileType};base64,${fileBuffer.toString('base64')}`;
            
            let folder = req.user.role === 'doctor' 
              ? `second-opinion/doctor_files/${req.user.id}`
              : `second-opinion/medical_files/${req.user.id}`;

            if (fieldname === 'registrationCertificate') {
              folder += '/certificates';
            } else if (fieldname === 'governmentId') {
              folder += '/ids';
            } else if (fieldname === 'profilePhoto') {
              folder += '/profile';
            }

            const result = await cloudinaryService.uploadFile(dataUri, {
              folder,
              resource_type: 'auto',
              public_id: path.parse(originalName).name
            });

            file.path = result.secure_url;
            file.cloudinaryId = result.public_id;
            file.urlPath = result.secure_url;
          }
        }
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
};