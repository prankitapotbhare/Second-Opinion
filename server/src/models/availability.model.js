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
      isAvailable: { type: Boolean, default: true },
      reservedUntil: { type: Date, default: null }
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
  // Fix the error with weekday format - change 'lowercase' to 'long' and convert to lowercase manually
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  
  // Check if doctor works on this day
  if (!this.workingDays[dayOfWeek] || dayOfWeek === this.weeklyHoliday) {
    return [];
  }
  
  // Get existing appointments for this date
  const PatientDetails = mongoose.model('PatientDetails');
  const existingAppointments = await PatientDetails.find({
    doctorId: this.doctorId,
    status: { $in: ['approved', 'under-review'] },
    'appointmentDetails.date': {
      $gte: new Date(date).setHours(0, 0, 0, 0),
      $lt: new Date(date).setHours(23, 59, 59, 999)
    }
  }).select('appointmentDetails.time');
  
  // Check if we have pre-generated time slots for this day
  const daySlots = this.timeSlots.find(day => day.day === dayOfWeek);
  
  if (daySlots && daySlots.slots.length > 0) {
    // Use pre-generated slots
    const availableSlots = [];
    
    for (const slot of daySlots.slots) {
      // Check if slot is available and not booked
      const isBooked = existingAppointments.some(
        appt => appt.appointmentDetails.time === slot.startTime
      );
      
      // Check if slot has a temporary reservation that hasn't expired
      const hasValidReservation = slot.reservedUntil && new Date() < new Date(slot.reservedUntil);
      
      if (slot.isAvailable && !isBooked && !hasValidReservation) {
        availableSlots.push(slot.startTime);
      }
    }
    
    return availableSlots;
  } else {
    // Fallback to generating slots on the fly
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
  }
};

// Method to check if a doctor is available on a specific date and time
availabilitySchema.methods.isAvailable = async function(date, time) {
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  
  // Check if doctor works on this day
  if (!this.workingDays[dayOfWeek] || dayOfWeek === this.weeklyHoliday) {
    return false;
  }
  
  // Check if the time is within working hours
  const [requestHour, requestMinute] = time.split(':').map(Number);
  const [startHour, startMinute] = this.startTime.split(':').map(Number);
  const [endHour, endMinute] = this.endTime.split(':').map(Number);
  
  const requestTime = requestHour * 60 + requestMinute;
  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;
  
  if (requestTime < startTime || requestTime >= endTime) {
    return false;
  }
  
  // Check if slot is reserved in timeSlots
  const daySlots = this.timeSlots.find(day => day.day === dayOfWeek);
  if (daySlots) {
    const timeSlot = daySlots.slots.find(slot => slot.startTime === time);
    if (timeSlot) {
      // If slot has reservedUntil and it's in the past, consider it available again
      if (timeSlot.reservedUntil && new Date() > new Date(timeSlot.reservedUntil)) {
        timeSlot.isAvailable = true;
        delete timeSlot.reservedUntil;
        await this.save();
        return true;
      }
      return timeSlot.isAvailable;
    }
  }
  
  // Get existing appointments for this date and time
  const PatientDetails = mongoose.model('PatientDetails');
  const existingAppointment = await PatientDetails.findOne({
    doctorId: this.doctorId,
    status: { $in: ['approved', 'under-review'] },
    'appointmentDetails.date': {
      $gte: new Date(date).setHours(0, 0, 0, 0),
      $lt: new Date(date).setHours(23, 59, 59, 999)
    },
    'appointmentDetails.time': time
  });
  
  return !existingAppointment;
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

// Method to reserve a slot temporarily
availabilitySchema.methods.reserveSlot = async function(date, time) {
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  
  // Check if doctor works on this day
  if (!this.workingDays[dayOfWeek] || dayOfWeek === this.weeklyHoliday) {
    return false;
  }
  
  // Find the day in timeSlots array
  let daySlots = this.timeSlots.find(day => day.day === dayOfWeek);
  
  // If day doesn't exist in timeSlots, create it
  if (!daySlots) {
    // Generate slots for this day if they don't exist
    await this.generateTimeSlots();
    
    // Try to find the day again after generation
    daySlots = this.timeSlots.find(day => day.day === dayOfWeek);
    
    // If still not found, create a basic entry
    if (!daySlots) {
      daySlots = {
        day: dayOfWeek,
        slots: []
      };
      this.timeSlots.push(daySlots);
    }
  }
  
  // Find the specific time slot
  let timeSlot = daySlots.slots.find(slot => slot.startTime === time);
  
  // If slot doesn't exist, create it
  if (!timeSlot) {
    // Calculate end time based on appointment duration
    const [hours, minutes] = time.split(':').map(Number);
    let endHour = hours;
    let endMinute = minutes + this.appointmentDuration;
    
    if (endMinute >= 60) {
      endHour += Math.floor(endMinute / 60);
      endMinute = endMinute % 60;
    }
    
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    
    timeSlot = {
      startTime: time,
      endTime: endTime,
      isAvailable: false,
      reservedUntil: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    };
    
    daySlots.slots.push(timeSlot);
  } else {
    // Check if the slot is already booked
    const PatientDetails = mongoose.model('PatientDetails');
    const existingAppointment = await PatientDetails.findOne({
      doctorId: this.doctorId,
      status: { $in: ['approved', 'under-review'] },
      'appointmentDetails.date': {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lt: new Date(date).setHours(23, 59, 59, 999)
      },
      'appointmentDetails.time': time
    });
    
    if (existingAppointment) {
      return false;
    }
    
    // Update existing slot
    timeSlot.isAvailable = false;
    timeSlot.reservedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
  }
  
  // Save the updated availability
  await this.save();
  
  return true;
};

// Update isAvailable method to check reservations
availabilitySchema.methods.isAvailable = async function(date, time) {
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  
  // Check if doctor works on this day
  if (!this.workingDays[dayOfWeek] || dayOfWeek === this.weeklyHoliday) {
    return false;
  }
  
  // Check if the time is within working hours
  const [requestHour, requestMinute] = time.split(':').map(Number);
  const [startHour, startMinute] = this.startTime.split(':').map(Number);
  const [endHour, endMinute] = this.endTime.split(':').map(Number);
  
  const requestTime = requestHour * 60 + requestMinute;
  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;
  
  if (requestTime < startTime || requestTime >= endTime) {
    return false;
  }
  
  // Check if slot is reserved in timeSlots
  const daySlots = this.timeSlots.find(day => day.day === dayOfWeek);
  if (daySlots) {
    const timeSlot = daySlots.slots.find(slot => slot.startTime === time);
    if (timeSlot) {
      // If slot has reservedUntil and it's in the past, consider it available again
      if (timeSlot.reservedUntil && new Date() > new Date(timeSlot.reservedUntil)) {
        timeSlot.isAvailable = true;
        delete timeSlot.reservedUntil;
        await this.save();
        return true;
      }
      return timeSlot.isAvailable;
    }
  }
  
  // Get existing appointments for this date and time
  const PatientDetails = mongoose.model('PatientDetails');
  const existingAppointment = await PatientDetails.findOne({
    doctorId: this.doctorId,
    status: { $in: ['approved', 'under-review'] },
    'appointmentDetails.date': {
      $gte: new Date(date).setHours(0, 0, 0, 0),
      $lt: new Date(date).setHours(23, 59, 59, 999)
    },
    'appointmentDetails.time': time
  });
  
  return !existingAppointment;
};

// Method to confirm a slot reservation permanently
availabilitySchema.methods.confirmSlot = async function(date, time) {
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  
  // Find the day in timeSlots array
  let daySlots = this.timeSlots.find(day => day.day === dayOfWeek);
  
  // If day exists in timeSlots
  if (daySlots) {
    // Find the specific time slot
    let timeSlot = daySlots.slots.find(slot => slot.startTime === time);
    
    // If slot exists, mark it as permanently unavailable
    if (timeSlot) {
      timeSlot.isAvailable = false;
      delete timeSlot.reservedUntil; // Remove temporary reservation
      await this.save();
    }
  }
  
  return true;
};

// Method to release a reserved slot
availabilitySchema.methods.releaseSlot = async function(date, time) {
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  
  // Find the day in timeSlots array
  let daySlots = this.timeSlots.find(day => day.day === dayOfWeek);
  
  // If day exists in timeSlots
  if (daySlots) {
    // Find the specific time slot
    let timeSlot = daySlots.slots.find(slot => slot.startTime === time);
    
    // If slot exists, mark it as available again
    if (timeSlot) {
      timeSlot.isAvailable = true;
      delete timeSlot.reservedUntil;
      await this.save();
    }
  }
  
  return true;
};

// Add this function after the schema definition but before creating the model
availabilitySchema.methods.generateTimeSlots = async function() {
  // Clear existing time slots
  this.timeSlots = [];
  
  // Get working days
  const workingDays = Object.entries(this.workingDays)
    .filter(([day, isWorking]) => isWorking && day !== this.weeklyHoliday)
    .map(([day]) => day);
  
  // Parse start and end times
  const [startHour, startMinute] = this.startTime.split(':').map(Number);
  const [endHour, endMinute] = this.endTime.split(':').map(Number);
  
  // For each working day, generate slots
  for (const day of workingDays) {
    const daySlots = {
      day,
      slots: []
    };
    
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    while (
      currentHour < endHour || 
      (currentHour === endHour && currentMinute < endMinute)
    ) {
      // Format current time as HH:MM
      const startTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      // Calculate end time for this slot
      let endSlotHour = currentHour;
      let endSlotMinute = currentMinute + this.appointmentDuration;
      
      if (endSlotMinute >= 60) {
        endSlotHour += Math.floor(endSlotMinute / 60);
        endSlotMinute = endSlotMinute % 60;
      }
      
      const endTime = `${endSlotHour.toString().padStart(2, '0')}:${endSlotMinute.toString().padStart(2, '0')}`;
      
      // Add slot to day's slots
      daySlots.slots.push({
        startTime,
        endTime,
        isAvailable: true
      });
      
      // Move to next slot (add appointment duration + buffer time)
      currentMinute += this.appointmentDuration + this.bufferTime;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }
    }
    
    // Add day slots to timeSlots array
    this.timeSlots.push(daySlots);
  }
  
  // Save the updated availability
  await this.save();
  
  return this.timeSlots;
};

// Add this to the setAvailability controller in doctor.controller.js to call the function
const Availability = mongoose.model('Availability', availabilitySchema);

module.exports = Availability;