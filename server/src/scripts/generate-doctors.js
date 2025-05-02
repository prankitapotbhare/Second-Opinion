const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const faker = require('faker');
const Doctor = require('../models/doctor.model');
const Availability = require('../models/availability.model');
const PatientDetails = require('../models/patientDetails.model');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/second-opinion';

const SPECIALIZATIONS = [
  "Cardiology", "Dermatology", "Endocrinology", "Gastroenterology", "Neurology",
  "Oncology", "Orthopedics", "Pediatrics", "Psychiatry", "Radiology", "Surgery", "Urology"
];
const LOCATIONS = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Nagpur', 'Pune', 'Hyderabad', 'Ahmedabad', 'Jaipur'
];
const LANGUAGES = ['English', 'Hindi', 'Marathi', 'Gujarati', 'Tamil', 'Telugu', 'Kannada', 'Bengali'];
const GENDERS = ['Male', 'Female', 'Other'];
const DEGREES = ['M.B.B.S.', 'M.D.', 'D.M.', 'M.S.', 'B.D.S.', 'M.Ch.'];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPhone() {
  return faker.phone.phoneNumber('9#########');
}

function randomLicense() {
  return faker.datatype.uuid().slice(0, 8).toUpperCase();
}

function randomFileObj(type, doctorId) {
  return {
    fileName: `${type}.jpg`,
    filePath: `C:\\fakepath\\doctor_files\\${doctorId}\\${type}-${Date.now()}-${faker.datatype.number()}.jpg`,
    fileType: 'image/jpeg',
    fileSize: faker.datatype.number({ min: 100000, max: 200000 }),
    uploadDate: new Date()
  };
}

function generateReviews(count) {
  const reviews = [];
  for (let i = 0; i < count; i++) {
    reviews.push({
      patientId: new mongoose.Types.ObjectId(),
      patientName: faker.name.findName(),
      rating: faker.datatype.number({ min: 3, max: 5 }),
      comment: faker.lorem.paragraph(),
      createdAt: faker.date.past(1)
    });
  }
  return reviews;
}

function calculateAverageRating(reviews) {
  if (!reviews.length) return 0;
  const sum = reviews.reduce((total, review) => total + review.rating, 0);
  return parseFloat((sum / reviews.length).toFixed(1));
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB:', MONGODB_URI);

  // Clean up previous test data (optional)
  await Doctor.deleteMany({});
  await Availability.deleteMany({});
  await PatientDetails.deleteMany({ doctorId: { $exists: true } });

  const passwordHash = await bcrypt.hash('Test@1234', 10);

  const doctors = [];
  const availabilities = [];

  for (let i = 0; i < 500; i++) {
    const name = faker.name.firstName() + ' ' + faker.name.lastName();
    const email = `tempdoc${i}@testmail.com`;
    const doctorId = new mongoose.Types.ObjectId();

    const specialization = randomFrom(SPECIALIZATIONS);
    const location = randomFrom(LOCATIONS);
    const gender = randomFrom(GENDERS);
    const degree = randomFrom(DEGREES);
    const experience = faker.datatype.number({ min: 1, max: 40 });
    const hospitalAffiliation = faker.company.companyName();
    const hospitalAddress = faker.address.streetAddress();
    const licenseNumber = randomLicense();
    const issuingMedicalCouncil = faker.address.city();
    const languages = faker.helpers.shuffle(LANGUAGES).slice(0, faker.datatype.number({ min: 1, max: 3 }));
    const phone = randomPhone();
    const emergencyContact = randomPhone();
    const consultationFee = faker.datatype.number({ min: 200, max: 2000 });
    const consultationAddress = faker.address.streetAddress();
    const bio = faker.lorem.paragraph();
    const photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`;

    // Generate random reviews (0-5 reviews per doctor)
    const reviewCount = faker.datatype.number({ min: 0, max: 5 });
    const reviews = generateReviews(reviewCount);
    const averageRating = calculateAverageRating(reviews);

    const now = new Date();
    const registrationCertificate = randomFileObj('registrationCertificate', doctorId);
    const governmentId = randomFileObj('governmentId', doctorId);

    const doctor = {
      _id: doctorId,
      name,
      email,
      password: passwordHash,
      gender,
      specialization,
      experience,
      degree,
      hospitalAffiliation,
      hospitalAddress,
      licenseNumber,
      issuingMedicalCouncil,
      languages,
      phone,
      emergencyContact,
      consultationFee,
      consultationAddress,
      location,
      registrationCertificate,
      governmentId,
      bio,
      photoURL,
      reviews,
      averageRating,
      isEmailVerified: true,
      emailVerifiedAt: now,
      isProfileComplete: true,
      profileCompletedAt: now,
      termsAccepted: true,
      termsAcceptedAt: now,
      role: 'doctor',
      createdAt: now,
      updatedAt: now
    };

    doctors.push(doctor);

    // Availability with more realistic settings
    const workingDays = {
      monday: Math.random() > 0.1, 
      tuesday: Math.random() > 0.1, 
      wednesday: Math.random() > 0.1, 
      thursday: Math.random() > 0.1,
      friday: Math.random() > 0.1, 
      saturday: Math.random() > 0.3, 
      sunday: Math.random() > 0.7
    };
    
    const startTime = faker.helpers.randomize(['09:00', '10:00', '10:30', '11:00']);
    const endTime = faker.helpers.randomize(['17:00', '18:00', '19:00', '20:00']);
    
    // Find a non-working day for weekly holiday
    let weeklyHoliday = Object.keys(workingDays).find(day => !workingDays[day]);
    // If all days are working days, default to Sunday
    if (!weeklyHoliday) {
      weeklyHoliday = 'sunday';
      workingDays.sunday = false;
    }

    // Generate time slots
    const timeSlots = [];
    const workingDaysList = Object.keys(workingDays).filter(day => workingDays[day]);
    
    for (const day of workingDaysList) {
      const daySlots = [];
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      
      let currentHour = startHour;
      let currentMinute = startMinute;
      
      // Duration and buffer time
      const appointmentDuration = 30;
      const bufferTime = 10;
      
      while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
        const slotStartTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        
        // Calculate end time for this slot
        let slotEndMinute = currentMinute + appointmentDuration;
        let slotEndHour = currentHour;
        
        if (slotEndMinute >= 60) {
          slotEndHour += Math.floor(slotEndMinute / 60);
          slotEndMinute = slotEndMinute % 60;
        }
        
        const slotEndTime = `${slotEndHour.toString().padStart(2, '0')}:${slotEndMinute.toString().padStart(2, '0')}`;
        
        daySlots.push({
          startTime: slotStartTime,
          endTime: slotEndTime,
          isAvailable: Math.random() > 0.2 // 80% chance of being available
        });
        
        // Move to next slot
        currentMinute += appointmentDuration + bufferTime;
        if (currentMinute >= 60) {
          currentHour += Math.floor(currentMinute / 60);
          currentMinute = currentMinute % 60;
        }
      }
      
      timeSlots.push({
        day,
        slots: daySlots
      });
    }

    const availability = {
      doctorId,
      workingDays,
      startTime,
      endTime,
      weeklyHoliday,
      timeSlots,
      maxAppointmentsPerDay: faker.datatype.number({ min: 5, max: 15 }),
      appointmentDuration: 30,
      bufferTime: 10,
      createdAt: now,
      updatedAt: now
    };

    availabilities.push(availability);
  }

  await Doctor.insertMany(doctors);
  await Availability.insertMany(availabilities);

  console.log('Inserted 500 temp doctors and their availabilities.');
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});