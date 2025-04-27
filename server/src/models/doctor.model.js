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
  specialization: {
    type: String,
    required: false
  },
  experience: {
    type: Number,
    required: false
  },
  licenseNumber: {
    type: String,
    required: false,
    unique: true,
    sparse: true
  },
  photoURL: {
    type: String,
    default: function() {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=3b82f6&color=fff`;
    }
  },
  profileCompleted: {
    type: Boolean,
    default: false
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
    default: 'doctor'
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