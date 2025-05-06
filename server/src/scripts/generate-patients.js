const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const faker = require('faker');
const Patient = require('../models/patient.model');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/second-opinion';

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB:', MONGODB_URI);

  // Clean up previous test data (optional)
  await Patient.deleteMany({});

  const passwordHash = await bcrypt.hash('Test@1234', 10);

  const patients = [];

  for (let i = 0; i < 500; i++) {
    const name = faker.name.firstName() + ' ' + faker.name.lastName();
    const email = `temppatient${i}@testmail.com`;
    const patientId = new mongoose.Types.ObjectId();
    const photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`;

    const now = new Date();

    const patient = {
      _id: patientId,
      name,
      email,
      password: passwordHash,
      photoURL,
      isEmailVerified: true,
      emailVerifiedAt: now,
      termsAccepted: true,
      termsAcceptedAt: now,
      role: 'patient',
      createdAt: now,
      updatedAt: now
    };

    // Randomly add googleId to some patients
    if (Math.random() > 0.7) {
      patient.googleId = faker.datatype.uuid();
    }

    patients.push(patient);
  }

  await Patient.insertMany(patients);

  console.log('Inserted 500 temp patients.');
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});