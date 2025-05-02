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
  // Maximum appointments per day
  maxAppointmentsPerDay: {
    type: Number,
    default: 10
  },
  // Appointment duration in minutes
  appointmentDuration: {
    type: Number,
    default: 30
  },
  // Buffer time between appointments in minutes
  bufferTime: {
    type: Number,
    default: 10
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
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Method to get available time slots for a specific date
availabilitySchema.methods.getAvailableSlots = async function(date) {
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
  
  // Check if doctor works on this day
  if (!this.workingDays[dayOfWeek] || dayOfWeek === this.weeklyHoliday) {
    return [];
  }
  
  // Get existing appointments for this date
  const PatientDetails = mongoose.model('PatientDetails');
  const existingAppointments = await PatientDetails.find({
    doctorId: this.doctorId,
    status: 'approved',
    'appointmentDetails.date': {
      $gte: new Date(date).setHours(0, 0, 0, 0),
      $lt: new Date(date).setHours(23, 59, 59, 999)
    }
  }).select('appointmentDetails.time');
  
  // Generate all possible time slots
  const slots = [];
  const [startHour, startMinute] = this.startTime.split(':').map(Number);
  const [endHour, endMinute] = this.endTime.split(':').map(Number);
  
  let currentHour = startHour;
  let currentMinute = startMinute;
  
  while (
    currentHour < endHour || 
    (currentHour === endHour && currentMinute < endMinute)
  ) {
    const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    
    // Check if this slot is already booked
    const isBooked = existingAppointments.some(
      appt => appt.appointmentDetails.time === timeString
    );
    
    if (!isBooked) {
      slots.push(timeString);
    }
    
    // Move to next slot
    currentMinute += this.appointmentDuration + this.bufferTime;
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60);
      currentMinute = currentMinute % 60;
    }
  }
  
  return slots;
};

// Method to check if a doctor is available on a specific date and time
availabilitySchema.methods.isAvailable = async function(date, time) {
  const slots = await this.getAvailableSlots(date);
  return slots.includes(time);
};

// Method to get appointment statistics for dashboard
availabilitySchema.methods.getAppointmentStats = async function() {
  const PatientDetails = mongoose.model('PatientDetails');
  
  // Get current date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get current week start and end
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday as start of week
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  // Get appointment counts for the week
  const weeklyAppointments = await PatientDetails.aggregate([
    {
      $match: {
        doctorId: this.doctorId,
        status: 'approved',
        'appointmentDetails.date': {
          $gte: startOfWeek,
          $lte: endOfWeek
        }
      }
    },
    {
      $group: {
        _id: { $dayOfWeek: '$appointmentDetails.date' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
  
  // Format the results for chart display
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weeklyStats = daysOfWeek.map((day, index) => {
    const dayData = weeklyAppointments.find(item => item._id === index + 1);
    return {
      day,
      count: dayData ? dayData.count : 0
    };
  });
  
  return {
    weeklyStats
  };
};

const Availability = mongoose.model('Availability', availabilitySchema);

module.exports = Availability;