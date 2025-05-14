const mongoose = require('mongoose');

const patientDetailsSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient ID is required']
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Doctor ID is required']
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required']
  },
  age: {
    type: Number,
    required: [true, 'Age is required']
  },
  relation: {
    type: String,
    required: [true, 'Relation is required']
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required']
  },
  // Existing fields
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Gender is required']
  },
  phone: {
    type: String,
    required: false
  },
  emergencyContact: {
    type: String
  },
  problem: {
    type: String,
    required: [true, 'Problem description is required']
  },
  medicalFiles: [{
    fileName: String,
    fileType: String,
    fileSize: Number,
    uploadDate: Date,
    filePath: String
  }],
  status: {
    type: String,
    enum: ['pending', 'opinion-needed', 'opinion-not-needed', 'under-review', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  doctorResponse: {
    message: String,
    responseDate: Date,
    secondOpinionRequired: {
      type: Boolean,
      default: false
    },
    responseFiles: [{
      fileName: String,
      fileType: String,
      fileSize: Number,
      uploadDate: Date,
      filePath: String
    }]
  },
  appointmentDetails: {
    date: Date,
    time: String,
    isCompleted: {
      type: Boolean,
      default: false
    },
    completedAt: Date
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for patient's age calculation
patientDetailsSchema.virtual('patientAge').get(function() {
  return this.age;
});

// Track status changes
patientDetailsSchema.pre('save', async function(next) {
  try {
    // Only proceed if status is being modified
    if (this.isModified('status')) {
      // Store the status change
      this._oldStatus = this.isModified('status') ? this._previousStatus || 'pending' : this.status;
      this._newStatus = this.status;
      this._statusChanged = true;
      
      // Store previous status for reference
      if (!this._previousStatus) {
        this._previousStatus = this.isModified('status') ? 
          this._oldStatus : this.status;
      }

      // Auto-update completedAt for completed status
      if (this.status === 'completed' && this.appointmentDetails) {
        this.appointmentDetails.isCompleted = true;
        this.appointmentDetails.completedAt = new Date();
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Send notifications after status change
patientDetailsSchema.post('save', async function() {
  try {
    // Only proceed if status was changed
    if (!this._statusChanged) {
      return;
    }

    const oldStatus = this._oldStatus;
    const newStatus = this._newStatus;
    
    // Get logger for debugging
    const logger = require('../utils/logger.util');
    logger.info(`PatientDetails post-save hook: Status changed from ${oldStatus} to ${newStatus} for patient details ID: ${this._id}`);

    // Import here to avoid circular dependency
    const twilioService = require('../services/twilio.service');
    
    // Use mongoose.model to avoid circular dependencies
    const Patient = mongoose.model('Patient');
    const Doctor = mongoose.model('Doctor');

    // Get patient and doctor details for the notification
    const patient = await Patient.findById(this.patientId);
    const doctor = await Doctor.findById(this.doctorId);
    
    if (!patient) {
      logger.warn(`Could not find patient with ID: ${this.patientId}`);
      return;
    }
    
    if (!doctor) {
      logger.warn(`Could not find doctor with ID: ${this.doctorId}`);
      return;
    }
    
    // Create properly formatted patient and doctor objects
    const patientObj = {
      ...patient.toObject(),
      name: patient.name || `${patient.firstName || ''} ${patient.lastName || ''}`.trim()
    };
    
    const doctorObj = {
      ...doctor.toObject(),
      name: doctor.name || `Dr. ${doctor.firstName || ''} ${doctor.lastName || ''}`.trim()
    };
    
    logger.info(`Found patient: ${patientObj.name}, doctor: ${doctorObj.name}`);
    
    // Send notification with properly formatted objects
    await twilioService.sendStatusChangeNotification(this, oldStatus, newStatus, patientObj, doctorObj);
    logger.info('Notification sent successfully');
  } catch (error) {
    // Log error but don't throw - we don't want to interrupt the main flow
    const logger = require('../utils/logger.util');
    logger.error('Error in post-save notification hook:', error);
    logger.error('Error stack:', error.stack);
  }
});

// Index for faster queries
patientDetailsSchema.index({ doctorId: 1, status: 1 });
patientDetailsSchema.index({ patientId: 1, submittedAt: -1 });
patientDetailsSchema.index({ updatedAt: -1 });

const PatientDetails = mongoose.model('PatientDetails', patientDetailsSchema);

module.exports = PatientDetails;