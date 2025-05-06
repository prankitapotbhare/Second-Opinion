const mongoose = require('mongoose');
const faker = require('faker');
const Patient = require('../models/patient.model');
const Doctor = require('../models/doctor.model');
const PatientDetails = require('../models/patientDetails.model');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/second-opinion';

const RELATIONS = ['Self', 'Spouse', 'Child', 'Parent', 'Sibling', 'Friend', 'Other'];
const GENDERS = ['Male', 'Female', 'Other'];
const PROBLEMS = [
  'Chronic back pain', 'Persistent headaches', 'Joint pain', 'Digestive issues', 
  'Skin rash', 'Breathing difficulties', 'Chest pain', 'Fatigue', 
  'Vision problems', 'Hearing loss', 'Dizziness', 'Sleep disorders',
  'Hypertension', 'Diabetes', 'Arthritis', 'Asthma', 'Allergies',
  'Thyroid disorder', 'Migraine', 'Anxiety', 'Depression'
];
const STATUS_OPTIONS = ['pending', 'opinion-needed', 'opinion-not-needed', 'under-review', 'approved', 'rejected', 'completed'];
const TIME_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPhone() {
  return faker.phone.phoneNumber('9#########');
}

function randomFileObj(type, patientId) {
  const fileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword'];
  const fileType = randomFrom(fileTypes);
  const extension = fileType === 'application/pdf' ? 'pdf' : 
                    fileType === 'image/jpeg' ? 'jpg' : 
                    fileType === 'image/png' ? 'png' : 'doc';
  
  return {
    fileName: `${type}-${faker.random.word()}.${extension}`,
    filePath: `C:\\fakepath\\patient_files\\${patientId}\\${type}-${Date.now()}-${faker.datatype.number()}.${extension}`,
    fileType: fileType,
    fileSize: faker.datatype.number({ min: 50000, max: 5000000 }),
    uploadDate: new Date()
  };
}

function getRandomDateInRange(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomFutureDate(minDays = 1, maxDays = 30) {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + faker.datatype.number({ min: minDays, max: maxDays }));
  return futureDate;
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB:', MONGODB_URI);

  // Clean up previous test data (optional)
  await PatientDetails.deleteMany({});

  // Get all patients and doctors from the database
  const patients = await Patient.find({}).lean();
  const doctors = await Doctor.find({}).lean();

  if (patients.length === 0 || doctors.length === 0) {
    console.error('No patients or doctors found in the database. Please run generate-patients.js and generate-doctors.js first.');
    await mongoose.disconnect();
    return;
  }

  console.log(`Found ${patients.length} patients and ${doctors.length} doctors.`);

  const patientDetailsList = [];
  
  // Create a map to track submissions per doctor
  const doctorSubmissionCount = {};
  doctors.forEach(doctor => {
    doctorSubmissionCount[doctor._id.toString()] = 0;
  });

  // Calculate minimum total records needed to ensure each doctor has at least 50 submissions
  const minTotalRecords = doctors.length * 50;
  const totalRecordsToGenerate = Math.max(10000, minTotalRecords);
  
  // Create patient details records
  for (let i = 0; i < totalRecordsToGenerate; i++) {
    const patient = randomFrom(patients);
    
    // Select doctor - prioritize doctors with fewer than 50 submissions
    let doctor;
    const doctorsWithLowSubmissions = doctors.filter(d => 
      doctorSubmissionCount[d._id.toString()] < 50
    );
    
    if (doctorsWithLowSubmissions.length > 0) {
      doctor = randomFrom(doctorsWithLowSubmissions);
    } else {
      doctor = randomFrom(doctors);
    }
    
    // Increment submission count for this doctor
    doctorSubmissionCount[doctor._id.toString()]++;
    
    const fullName = faker.name.findName();
    const age = faker.datatype.number({ min: 1, max: 90 });
    const relation = randomFrom(RELATIONS);
    const contactNumber = randomPhone();
    const email = faker.internet.email();
    const gender = randomFrom(GENDERS);
    const phone = randomPhone();
    const emergencyContact = randomPhone();
    const problem = randomFrom(PROBLEMS) + ': ' + faker.lorem.paragraph(2);
    
    // Generate 1-5 medical files with different types
    const medicalFiles = [];
    const fileCount = faker.datatype.number({ min: 1, max: 5 });
    for (let j = 0; j < fileCount; j++) {
      medicalFiles.push(randomFileObj('medical', patient._id));
    }
    
    const status = randomFrom(STATUS_OPTIONS);
    
    // Create dates with proper chronology - limited to one month in the past
    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);
    
    const submittedAt = getRandomDateInRange(oneMonthAgo, now);
    const createdAt = submittedAt;
    const updatedAt = new Date(Math.max(submittedAt.getTime(), now.getTime() - 1000 * 60 * 60 * 24 * 30)); // Between submission and now
    
    const patientDetails = {
      patientId: patient._id,
      doctorId: doctor._id,
      fullName: patient.name,
      age,
      relation,
      contactNumber,
      email: patient.email,
      gender,
      phone,
      emergencyContact,
      problem,
      medicalFiles,
      status,
      submittedAt,
      createdAt,
      updatedAt
    };
    
    // Add doctor response for cases that aren't pending
    if (status !== 'pending') {
      const responseDelay = faker.datatype.number({ min: 1, max: 7 }); // 1-7 days response time
      const responseDate = new Date(submittedAt);
      responseDate.setDate(submittedAt.getDate() + responseDelay);
      
      // Ensure response date is not in the future
      const responseDateTime = Math.min(responseDate.getTime(), now.getTime());
      
      patientDetails.doctorResponse = {
        message: faker.lorem.paragraphs(faker.datatype.number({ min: 1, max: 3 })),
        responseDate: new Date(responseDateTime),
        secondOpinionRequired: status === 'opinion-needed' ? true : status === 'opinion-not-needed' ? false : Math.random() > 0.5,
        responseFiles: []
      };
      
      // Add response files for some cases
      if (Math.random() > 0.3) {
        const responseFileCount = faker.datatype.number({ min: 1, max: 3 });
        for (let j = 0; j < responseFileCount; j++) {
          patientDetails.doctorResponse.responseFiles.push(randomFileObj('response', patient._id));
        }
      }
    }
    
    // Add appointment details for under-review, approved, rejected, or completed cases
    if (['under-review', 'approved', 'rejected', 'completed'].includes(status)) {
      const appointmentDelay = faker.datatype.number({ min: 7, max: 30 }); // 7-30 days after submission
      let appointmentDate = new Date(submittedAt);
      appointmentDate.setDate(submittedAt.getDate() + appointmentDelay);
      
      // For completed appointments, ensure the date is in the past
      if (status === 'completed') {
        appointmentDate = getRandomDateInRange(submittedAt, now);
      } else if (status === 'approved') {
        // For approved appointments, could be past or future
        if (Math.random() > 0.5) {
          appointmentDate = getRandomFutureDate(1, 30);
        } else {
          appointmentDate = getRandomDateInRange(submittedAt, now);
        }
      } else if (status === 'under-review') {
        // For under-review, appointment should be in the future
        appointmentDate = getRandomFutureDate(1, 30);
      }
      
      patientDetails.appointmentDetails = {
        date: appointmentDate,
        time: randomFrom(TIME_SLOTS),
        isCompleted: status === 'completed',
        completedAt: status === 'completed' ? new Date(Math.min(appointmentDate.getTime() + 24 * 60 * 60 * 1000, now.getTime())) : null
      };
    }
    
    patientDetailsList.push(patientDetails);
    
    if ((i + 1) % 1000 === 0) {
      console.log(`Generated ${i + 1} patient details records...`);
    }
  }

  // Insert in batches to avoid memory issues
  const BATCH_SIZE = 1000;
  for (let i = 0; i < patientDetailsList.length; i += BATCH_SIZE) {
    const batch = patientDetailsList.slice(i, i + BATCH_SIZE);
    await PatientDetails.insertMany(batch);
    console.log(`Inserted batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(patientDetailsList.length / BATCH_SIZE)}`);
  }

  console.log(`Successfully inserted ${patientDetailsList.length} patient details records.`);
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

main().catch(err => {
  console.error('Error in script execution:', err);
  mongoose.disconnect();
  process.exit(1);
});