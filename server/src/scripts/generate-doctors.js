const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const faker = require('faker');
const Doctor = require('../models/doctor.model');
const Availability = require('../models/availability.model');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/second-opinion';

const SPECIALIZATIONS = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Dermatology', 'Pediatrics',
  'Oncology', 'Psychiatry', 'Gastroenterology', 'Urology', 'Ophthalmology'
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

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB:', MONGODB_URI);

  // Clean up previous test data (optional)
  await Doctor.deleteMany({});
  await Availability.deleteMany({});

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
    const bio = faker.lorem.sentence();
    const photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`;

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

    // Availability
    const workingDays = {
      monday: true, tuesday: true, wednesday: true, thursday: true,
      friday: true, saturday: Math.random() > 0.3, sunday: Math.random() > 0.7
    };
    const startTime = faker.helpers.randomize(['09:00', '10:00', '10:30', '11:00']);
    const endTime = faker.helpers.randomize(['17:00', '18:00', '19:00', '20:00']);
    const weeklyHoliday = Object.keys(workingDays).find(day => !workingDays[day]) || 'sunday';

    const availability = {
      doctorId,
      workingDays,
      startTime,
      endTime,
      weeklyHoliday,
      timeSlots: [],
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