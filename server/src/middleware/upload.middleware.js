
const multer = require('multer');
const path = require('path');
const { 
  ALLOWED_FILE_TYPES, 
  ALLOWED_DOCUMENT_TYPES, 
  FILE_SIZE_LIMITS 
} = require('../utils/constants');
const { uploadToCloudinary } = require('../services/file.service');

// Memory storage configuration
const memoryStorage = multer.memoryStorage();

// File filters
const medicalFileFilter = (req, file, cb) => {
  if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`), false);
  }
};

const doctorDocumentFilter = (req, file, cb) => {
  if (ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type. Allowed types: ${ALLOWED_DOCUMENT_TYPES.join(', ')}`), false);
  }
};

// Multer configurations
exports.patientFileUpload = multer({
  storage: memoryStorage,
  limits: { fileSize: FILE_SIZE_LIMITS.MEDICAL_FILE },
  fileFilter: medicalFileFilter
});

exports.doctorFileUpload = multer({
  storage: memoryStorage,
  limits: { fileSize: FILE_SIZE_LIMITS.DOCTOR_DOCUMENT },
  fileFilter: doctorDocumentFilter
});

// Error handler
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

// for doctor file uploads
exports.processFileUploads = async (req, res, next) => {
  if (!req.files && !req.file) return next();

  try {
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: `medical_files/patient_${req.user.id}`,
        resource_type: 'auto',
      });

      if (!result || !result.secure_url) {
        throw new Error('Cloudinary upload failed for single file');
      }

      req.file.cloudinaryData = result;
    }

    req.filesData = {}; // Object to store file data

    if (req.files && !Array.isArray(req.files)) {
      for (const fieldname of Object.keys(req.files)) {
        for (const file of req.files[fieldname]) {
          const result = await uploadToCloudinary(file.buffer, {
            folder: `doctor_documents/doctor_${req.user.id}/${fieldname}`,
            resource_type: 'auto',
          });

          if (!result || !result.secure_url) {
            throw new Error(`Cloudinary upload failed for field ${fieldname}`);
          }

          file.cloudinaryData = result;

          req.filesData[fieldname] = {
            url: result.secure_url,
            public_id: result.public_id,
          };
        }
      }
    }

    next();
  } catch (error) {
    console.error('File upload error:', error);
    next(error);
  }
};


exports.processPatientFileUploads = async (req, res, next) => {
  try {
    req.filesData = {};

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      console.log('❌ No files uploaded');
      return next();
    }

    const medicalUploads = [];

    for (const file of req.files) {
      const uploaded = await uploadToCloudinary(file.buffer, {
        folder: 'patient/medicalFiles',
        resource_type: 'auto',
      });

      medicalUploads.push({
        fileName: file.originalname,
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
        fileType: file.mimetype,
        fileSize: file.size,
      });
    }

    req.filesData.medicalFiles = medicalUploads;

    console.log('📁 Uploaded medical files:', req.filesData.medicalFiles);
    next();
  } catch (error) {
    console.error('❌ Patient file upload error:', error);
    return res.status(500).json({ message: 'File upload failed', error });
  }
};
