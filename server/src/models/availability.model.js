const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
    index: true // Add index for better query performance
  },
  workingDays: {
    monday: { type: Boolean, default: false },
    tuesday: { type: Boolean, default: false },
    wednesday: { type: Boolean, default: false },
    thursday: { type: Boolean, default: false },
    friday: { type: Boolean, default: false },
    saturday: { type: Boolean, default: false },
    sunday: { type: Boolean, default: false }
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    default: '09:00'
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    default: '17:00'
  },
  weeklyHoliday: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    default: 'sunday'
  },
  // For future implementation of specific time slots
  timeSlots: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    slots: [{
      startTime: String,
      endTime: String,
      isAvailable: { type: Boolean, default: true }
    }]
  }],
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
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add a pre-save hook to update the doctor's availability reference
availabilitySchema.pre('save', async function(next) {
  try {
    // Update the doctor's availability reference
    await mongoose.model('Doctor').findByIdAndUpdate(
      this.doctorId,
      { availability: this._id }
    );
    next();
  } catch (error) {
    next(error);
  }
});

const Availability = mongoose.model('Availability', availabilitySchema);

module.exports = Availability;