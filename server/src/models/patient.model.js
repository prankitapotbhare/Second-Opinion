const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const patientSchema = new mongoose.Schema({
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
  firebaseUid: {
    type: String,
    sparse: true,
    index: true
  },
  photoURL: {
    type: String,
    default: function() {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=3b82f6&color=fff`;
    }
  },
  // Update field name for consistency with auth.service.js
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  // Add new field for tracking when email was verified
  emailVerifiedAt: {
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
  // Add role field for consistency
  role: {
    type: String,
    default: 'patient',
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

// Pre-save hook to hash password
patientSchema.pre('save', async function(next) {
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
patientSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Add a virtual property to ensure backward compatibility
patientSchema.virtual('emailVerified').get(function() {
  return this.isEmailVerified;
});

patientSchema.virtual('emailVerified').set(function(value) {
  this.isEmailVerified = value;
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;