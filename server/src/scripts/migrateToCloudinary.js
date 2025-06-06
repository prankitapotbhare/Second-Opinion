/**
 * Script to migrate existing files from local storage to Cloudinary
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cloudinaryService = require('../services/cloudinary.service');
const { UPLOADS_DIR } = require('../utils/constants');

// MongoDB models
const Doctor = require('../models/doctor.model');
const Patient = require('../models/patient.model');
const PatientDetails = require('../models/patientDetails.model');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/second-opinion';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

/**
 * Upload a file to Cloudinary and return the result
 * @param {string} filePath - Local file path
 * @param {string} folder - Cloudinary folder
 * @returns {Promise<Object>} Cloudinary upload result
 */
async function uploadToCloudinary(filePath, folder) {
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return null;
    }
    
    console.log(`Uploading ${filePath} to Cloudinary folder ${folder}...`);
    
    const result = await cloudinaryService.uploadFile(filePath, {
      folder,
      resource_type: 'auto'
    });
    
    return result;
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Migrate doctor files
 */
async function migrateDoctorFiles() {
  console.log('\nMigrating doctor files...');
  
  const doctors = await Doctor.find({});
  console.log(`Found ${doctors.length} doctors`);
  
  let migratedCount = 0;
  
  for (const doctor of doctors) {
    const doctorId = doctor._id.toString();
    const doctorFolder = `second-opinion/doctor_files/${doctorId}`;
    
    // Migrate registration certificate
    if (doctor.documents && doctor.documents.registrationCertificate && doctor.documents.registrationCertificate.filePath) {
      const filePath = doctor.documents.registrationCertificate.filePath;
      
      // Convert URL path to local file path
      const localPath = filePath.replace(/^http:\/\/localhost:5000\/uploads\//i, path.join(UPLOADS_DIR, '/'));
      
      // Upload to Cloudinary
      const result = await uploadToCloudinary(localPath, `${doctorFolder}/certificates`);
      
      if (result) {
        // Update doctor document with Cloudinary URL
        doctor.documents.registrationCertificate.filePath = result.secure_url;
        doctor.documents.registrationCertificate.cloudinaryId = result.public_id;
        migratedCount++;
      }
    }
    
    // Migrate government ID
    if (doctor.documents && doctor.documents.governmentId && doctor.documents.governmentId.filePath) {
      const filePath = doctor.documents.governmentId.filePath;
      
      // Convert URL path to local file path
      const localPath = filePath.replace(/^http:\/\/localhost:5000\/uploads\//i, path.join(UPLOADS_DIR, '/'));
      
      // Upload to Cloudinary
      const result = await uploadToCloudinary(localPath, `${doctorFolder}/ids`);
      
      if (result) {
        // Update doctor document with Cloudinary URL
        doctor.documents.governmentId.filePath = result.secure_url;
        doctor.documents.governmentId.cloudinaryId = result.public_id;
        migratedCount++;
      }
    }
    
    // Migrate profile photo
    if (doctor.profilePhoto && !doctor.profilePhoto.startsWith('https://res.cloudinary.com')) {
      const filePath = doctor.profilePhoto;
      
      // Convert URL path to local file path
      const localPath = filePath.replace(/^http:\/\/localhost:5000\/uploads\//i, path.join(UPLOADS_DIR, '/'));
      
      // Upload to Cloudinary
      const result = await uploadToCloudinary(localPath, `${doctorFolder}/profile`);
      
      if (result) {
        // Update doctor document with Cloudinary URL
        doctor.profilePhoto = result.secure_url;
        migratedCount++;
      }
    }
    
    // Save doctor document
    await doctor.save();
  }
  
  console.log(`Migrated ${migratedCount} doctor files`);
}

/**
 * Migrate patient files
 */
async function migratePatientFiles() {
  console.log('\nMigrating patient files...');
  
  const patientDetails = await PatientDetails.find({});
  console.log(`Found ${patientDetails.length} patient details records`);
  
  let migratedCount = 0;
  
  for (const details of patientDetails) {
    const patientId = details.patient.toString();
    const patientFolder = `second-opinion/medical_files/${patientId}`;
    
    // Migrate medical files
    if (details.medicalFiles && details.medicalFiles.length > 0) {
      for (let i = 0; i < details.medicalFiles.length; i++) {
        const file = details.medicalFiles[i];
        
        if (file && file.filePath && !file.filePath.startsWith('https://res.cloudinary.com')) {
          // Convert URL path to local file path
          const localPath = file.filePath.replace(/^http:\/\/localhost:5000\/uploads\//i, path.join(UPLOADS_DIR, '/'));
          
          // Upload to Cloudinary
          const result = await uploadToCloudinary(localPath, patientFolder);
          
          if (result) {
            // Update file with Cloudinary URL
            details.medicalFiles[i].filePath = result.secure_url;
            details.medicalFiles[i].cloudinaryId = result.public_id;
            migratedCount++;
          }
        }
      }
    }
    
    // Save patient details document
    await details.save();
  }
  
  console.log(`Migrated ${migratedCount} patient files`);
}

/**
 * Main migration function
 */
async function migrateFiles() {
  try {
    console.log('Starting file migration to Cloudinary...');
    
    // Migrate doctor files
    await migrateDoctorFiles();
    
    // Migrate patient files
    await migratePatientFiles();
    
    console.log('\nMigration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close MongoDB connection
    mongoose.connection.close();
  }
}

// Run migration
migrateFiles();