const Admin = require('../models/admin.model');
const Patient = require('../models/patient.model');
const Doctor = require('../models/doctor.model');
const PatientDetails = require('../models/patientDetails.model');
const validationService = require('../services/validation.service');
const excelService = require('../services/excel.service');
const pdfService = require('../services/pdf.service');
const emailService = require('../services/email.service');
const mongoose = require('mongoose');
const path = require('path');

exports.getStats = async (req, res, next) => {
  try {
    // Get counts from each model
    const [
      totalDoctors,
      totalPatients,
      completedAppointments,
      pendingAppointments
    ] = await Promise.all([
      Doctor.countDocuments({}),
      Patient.countDocuments({}),
      PatientDetails.countDocuments({ status: 'completed' }),
      PatientDetails.countDocuments({ status: 'pending' })
    ]);

    // Return the statistics
    res.status(200).json({
      success: true,
      message: 'Admin statistics retrieved successfully',
      data: {
        totalDoctors,
        totalPatients,
        completedAppointments,
        pendingAppointments
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all doctors (admin function)
exports.getAllDoctors = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sort = '-createdAt';
    
    // Get basic doctor information
    const doctors = await Doctor.find({})
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Doctor.countDocuments({});
    const totalPages = Math.ceil(total / limit);
    
    // Enhance doctor data with appointment statistics
    const enhancedDoctors = await Promise.all(doctors.map(async (doctor) => {
      // Get total appointments for this doctor
      const totalAppointments = await PatientDetails.countDocuments({ 
        doctorId: doctor._id 
      });
      
      // Get accepted/completed appointments for this doctor
      const acceptedAppointments = await PatientDetails.countDocuments({ 
        doctorId: doctor._id,
        status: 'completed'
      });
      
      // Return formatted doctor data
      return {
        id: doctor._id,
        name: doctor.name || `Dr. ${doctor.firstName || ''} ${doctor.lastName || ''}`.trim(),
        specialty: doctor.specialization || doctor.specialty || 'General',
        totalAppointments,
        acceptedAppointments,
        // Include other fields that might be needed
        email: doctor.email,
        photoURL: doctor.photoURL,
        createdAt: doctor.createdAt
      };
    }));
    
    res.status(200).json({
      success: true,
      message: 'Doctors retrieved successfully',
      data: enhancedDoctors,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all patients (admin function)
exports.getAllPatients = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sort = '-createdAt';
    
    // Get basic patient information
    const patients = await Patient.find({})
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Patient.countDocuments({});
    const totalPages = Math.ceil(total / limit);
    
    // Enhance patient data with details from PatientDetails
    const formattedPatients = await Promise.all(patients.map(async (patient) => {
      // Get the most recent patient details for this patient
      const patientDetail = await PatientDetails.findOne({ 
        patientId: patient._id 
      }).sort({ updatedAt: -1 });
      
      return {
        id: patient._id,
        name: patient.name || `${patient.firstName || ''} ${patient.lastName || ''}`.trim(),
        gender: patientDetail?.gender || patient.gender || 'Not specified',
        contactNumber: patientDetail?.contactNumber || patient.contactNumber || patient.phone || 'Not provided',
        // Include other fields that might be needed
        email: patient.email,
        photoURL: patient.photoURL,
        createdAt: patient.createdAt
      };
    }));
    
    res.status(200).json({
      success: true,
      message: 'Patients retrieved successfully',
      data: formattedPatients,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get doctor's patients in Excel format
exports.getDoctorPatientsExcel = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    
    // Validate doctorId
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID'
      });
    }
    
    // Get doctor details
    const doctor = await Doctor.findById(doctorId).select('-password');
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    // Format doctor data
    const formattedDoctor = {
      id: doctor._id,
      name: doctor.name || `Dr. ${doctor.firstName || ''} ${doctor.lastName || ''}`.trim(),
      specialty: doctor.specialization || doctor.specialty || 'General',
      email: doctor.email
    };
    
    // Get all patient details for this doctor
    const patientDetails = await PatientDetails.find({ doctorId });
    
    // Format patient data directly from patientDetails
    const formattedPatients = patientDetails.map(detail => {
      return {
        id: detail.patientId,
        name: detail.fullName,
        gender: detail.gender || 'Not specified',
        contactNumber: detail.contactNumber || detail.phone || 'Not provided',
        email: detail.email || 'Not provided',
        age: detail.age,
        problem: detail.problem
      };
    });
    
    // Generate Excel file
    const excelFilePath = await excelService.generateDoctorPatientsExcel(formattedPatients, formattedDoctor);
    
    // Send file as download
    res.download(excelFilePath, `${formattedDoctor.name}_patients.xlsx`, (err) => {
      if (err) {
        next(err);
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Get doctor's invoice as PDF
exports.getDoctorInvoicePdf = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    
    // Validate doctorId
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID'
      });
    }
    
    // Get doctor details
    const doctor = await Doctor.findById(doctorId).select('-password');
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    // Format doctor data
    const formattedDoctor = {
      id: doctor._id,
      name: doctor.name || `Dr. ${doctor.firstName || ''} ${doctor.lastName || ''}`.trim(),
      specialty: doctor.specialization || doctor.specialty || 'General',
      email: doctor.email
    };
    
    // Get all patient details for this doctor
    const patientDetails = await PatientDetails.find({ doctorId });
    
    // Format patient data directly from patientDetails
    const formattedPatients = patientDetails.map(detail => {
      return {
        id: detail.patientId,
        name: detail.fullName,
        gender: detail.gender || 'Not specified',
        contactNumber: detail.contactNumber || detail.phone || 'Not provided',
        email: detail.email || 'Not provided',
        problem: detail.problem,
        status: detail.status
      };
    });
    
    // Generate PDF file
    const pdfFilePath = await pdfService.generateDoctorInvoicePdf(formattedPatients, formattedDoctor);
    
    // Send file as download
    res.download(pdfFilePath, `${formattedDoctor.name}_invoice.pdf`, (err) => {
      if (err) {
        next(err);
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Send invoice to doctor via email
exports.sendDoctorInvoiceEmail = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    
    // Validate doctorId
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID'
      });
    }
    
    // Get doctor details
    const doctor = await Doctor.findById(doctorId).select('-password');
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    // Format doctor data
    const formattedDoctor = {
      id: doctor._id,
      name: doctor.name || `Dr. ${doctor.firstName || ''} ${doctor.lastName || ''}`.trim(),
      specialty: doctor.specialization || doctor.specialty || 'General',
      email: doctor.email
    };
    
    // Get all patient details for this doctor
    const patientDetails = await PatientDetails.find({ doctorId });
    
    // Format patient data directly from patientDetails
    const formattedPatients = patientDetails.map(detail => {
      return {
        id: detail.patientId,
        name: detail.fullName,
        gender: detail.gender || 'Not specified',
        contactNumber: detail.contactNumber || detail.phone || 'Not provided',
        email: detail.email || 'Not provided',
        problem: detail.problem,
        submittedAt: detail.submittedAt
      };
    });
    
    // Generate PDF file
    const pdfFilePath = await pdfService.generateDoctorInvoicePdf(formattedPatients, formattedDoctor);
    
    // Send email with PDF attachment
    await emailService.sendInvoiceEmail(formattedDoctor.email, formattedDoctor.name, pdfFilePath);
    
    res.status(200).json({
      success: true,
      message: 'Invoice sent successfully to doctor\'s email'
    });
    
  } catch (error) {
    next(error);
  }
};
