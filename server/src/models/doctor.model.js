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
  firebaseUid: {
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
  // Add reviews schema
  reviews: [{
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Calculate average rating
  averageRating: {
    type: Number,
    default: 0
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
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.id;
      return ret;
    }
  },
  toObject: { virtuals: true }
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

// Add a virtual field for availability reference
doctorSchema.virtual('availability', {
  ref: 'Availability',
  localField: '_id',
  foreignField: 'doctorId',
  justOne: true
});

// Add a virtual field for appointment counts
doctorSchema.virtual('appointmentCounts').get(async function() {
  const PatientDetails = mongoose.model('PatientDetails');
  
  const counts = await PatientDetails.aggregate([
    { $match: { doctorId: this._id } },
    { $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
    rejected: 0,
    'opinion-needed': 0,
    'opinion-not-needed': 0
  };
  
  counts.forEach(item => {
    result[item._id] = item.count;
    result.total += item.count;
  });
  
  return result;
});

// Add a method to get today's appointments
doctorSchema.methods.getTodayAppointments = async function() {
  const PatientDetails = mongoose.model('PatientDetails');
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return await PatientDetails.find({
    doctorId: this._id,
    status: 'approved',
    'appointmentDetails.date': {
      $gte: today,
      $lt: tomorrow
    }
  }).sort({ 'appointmentDetails.time': 1 });
};

// Add a method to get dashboard statistics
doctorSchema.methods.getDashboardStats = async function() {
  const PatientDetails = mongoose.model('PatientDetails');
  
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
      doctorId: this._id,
      status: 'approved',
      'appointmentDetails.date': {
        $gte: today,
        $lt: tomorrow
      }
    }),
    
    // Pending appointments (requests)
    PatientDetails.countDocuments({
      doctorId: this._id,
      status: 'pending'
    }),
    
    // Completed appointments
    PatientDetails.countDocuments({
      doctorId: this._id,
      status: 'completed'
    }),
    
    // Total unique patients
    PatientDetails.distinct('patientId', { doctorId: this._id }).then(ids => ids.length)
  ]);
  
  return {
    todayAppointments,
    pendingAppointments,
    completedAppointments,
    totalPatients
  };
};

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;