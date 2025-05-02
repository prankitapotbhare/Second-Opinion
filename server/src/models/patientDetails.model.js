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
    notes: String,
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

// Index for faster queries
patientDetailsSchema.index({ doctorId: 1, status: 1 });
patientDetailsSchema.index({ patientId: 1, submittedAt: -1 });
patientDetailsSchema.index({ updatedAt: -1 });

const PatientDetails = mongoose.model('PatientDetails', patientDetailsSchema);

module.exports = PatientDetails;