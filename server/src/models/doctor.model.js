const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  googleId: {
    type: String,
    sparse: true,
    index: true
  },
  // Add gender field
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: false
  },
  specialization: {
    type: String,
    required: false
  },
  experience: {
    type: Number,
    required: false
  },
  // Add degree field
  degree: {
    type: String,
    required: false,
    trim: true
  },
  // New fields for doctor profile
  hospitalAffiliation: {
    type: String,
    required: false
  },
  hospitalAddress: {
    type: String,
    required: false
  },
  licenseNumber: {
    type: String,
    required: false,
    unique: true,
    sparse: true
  },
  issuingMedicalCouncil: {
    type: String,
    required: false
  },
  languages: {
    type: [String],
    default: []
  },
  phone: {
    type: String,
    required: false
  },
  emergencyContact: {
    type: String,
    required: false
  },
  consultationFee: {
    type: Number,
    required: false
  },
  consultationAddress: {
    type: String,
    required: false
  },
  location: {
    type: String,
    required: false
  },
  registrationCertificate: {
    fileName: String,
    fileType: String,
    fileSize: Number,
    uploadDate: Date,
    filePath: String
  },
  governmentId: {
    fileName: String,
    fileType: String,
    fileSize: Number,
    uploadDate: Date,
    filePath: String
  },
  bio: {
    type: String,
    required: false
  },
  photoURL: {
    type: String,
    default: function() {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=3b82f6&color=fff`;
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerifiedAt: {
    type: Date,
    default: null
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  profileCompletedAt: {
    type: Date,
    default: null
  },
  termsAccepted: {
    type: Boolean,
    default: false,
    required: [true, 'Terms and conditions must be accepted']
  },
  termsAcceptedAt: {
    type: Date,
    default: null
  },
  role: {
    type: String,
    default: 'doctor',
    immutable: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add a virtual property to ensure backward compatibility
doctorSchema.virtual('emailVerified').get(function() {
  return this.isEmailVerified;
});

doctorSchema.virtual('emailVerified').set(function(value) {
  this.isEmailVerified = value;
});

// Pre-save hook to hash password
doctorSchema.pre('save', async function(next) {
  // Only hash the password if it's modified or new
  if (!this.isModified('password')) return next();
  
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash password
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
doctorSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;