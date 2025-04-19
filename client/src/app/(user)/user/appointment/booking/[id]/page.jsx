"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { doctors as doctorsData } from '@/data/doctorsData';
import Link from 'next/link';
import { FaCalendarAlt, FaClock, FaChevronLeft, FaChevronRight, FaUpload, FaTimes } from 'react-icons/fa';

export default function AppointmentBookingPage() {
  const { id: pathId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const doctorId = searchParams.get('doctorId') || pathId;
  const appointmentType = searchParams.get('type') || 'in-person';
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Appointment booking states
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [gender, setGender] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [currentDate] = useState(new Date());
  const [currentViewStartDate, setCurrentViewStartDate] = useState(new Date());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: ''
  });
  
  useEffect(() => {
    // Find the doctor based on the ID from query or path
    const foundDoctor = doctorsData.find(doc => doc.id === doctorId);
    if (foundDoctor) {
      setDoctor(foundDoctor);
    }
    setLoading(false);
    
    // Set default selected date to today
    const today = new Date();
    setSelectedDate(today.getDate());
    
    // Initialize currentViewStartDate
    setCurrentViewStartDate(today);
  }, [doctorId]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const getDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentViewStartDate);
      date.setDate(currentViewStartDate.getDate() + i);
      dates.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear()
      });
    }
    return dates;
  };
  
  // Navigate to previous/next set of dates
  const goToPreviousDates = () => {
    const newDate = new Date(currentViewStartDate);
    newDate.setDate(newDate.getDate() - 7);
    if (newDate >= currentDate) {
      setCurrentViewStartDate(newDate);
    }
  };
  
  const goToNextDates = () => {
    const newDate = new Date(currentViewStartDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentViewStartDate(newDate);
  };
  
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];
  
  const handleFileUpload = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setUploadedFiles([...uploadedFiles, ...filesArray]);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files);
      setUploadedFiles([...uploadedFiles, ...filesArray]);
    }
  };
  
  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Process form submission
    console.log({
      doctor: doctor?.name,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      gender,
      files: uploadedFiles.map(file => file.name),
      ...formData
    });
    
    // In a real app, you would send this data to your backend
    // For now, redirect to confirmation page
    router.push('/user/appointment/confirmation');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!doctor) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Doctor not found</h2>
        <Link href="/user/doctors" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Browse Doctors
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back button */}
        <div className="mb-6">
          <Link href="/user/doctors" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <FaChevronLeft className="mr-2" /> Back to Doctors
          </Link>
        </div>
        
        {/* Doctor Info */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="w-20 h-20 rounded-full overflow-hidden mb-4 sm:mb-0 sm:mr-6 mx-auto sm:mx-0">
              <img
                src={doctor.imageUrl || "https://via.placeholder.com/150"}
                alt={doctor.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{doctor.name}</h1>
              <p className="text-md sm:text-lg text-green-600">{doctor.department}</p>
              <p className="text-sm sm:text-base text-gray-600">{doctor.degree} • {doctor.experience} experience</p>
            </div>
          </div>
        </div>
        
        {/* Appointment Booking Form */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Book Your Appointment</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Appointment Type */}
            <div>
              <h3 className="text-md sm:text-lg font-medium text-gray-900 mb-3 flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" /> Appointment Type
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                  appointmentType === 'video' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="appointmentType"
                    value="video"
                    checked={appointmentType === 'video'}
                    onChange={() => router.push(`/user/appointment/booking/${doctorId}?type=video`)}
                    className="h-4 w-4 text-blue-600 mr-2"
                  />
                  <div>
                    <span className="font-medium">Video Consultation</span>
                    <p className="text-sm text-gray-500">Consult from the comfort of your home</p>
                  </div>
                </label>
                
                <label className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                  appointmentType === 'in-person' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="appointmentType"
                    value="in-person"
                    checked={appointmentType === 'in-person'}
                    onChange={() => router.push(`/user/appointment/booking/${doctorId}?type=in-person`)}
                    className="h-4 w-4 text-blue-600 mr-2"
                  />
                  <div>
                    <span className="font-medium">In-Person Visit</span>
                    <p className="text-sm text-gray-500">Visit the doctor at the clinic</p>
                  </div>
                </label>
              </div>
            </div>
            
            {/* Date Selection */}
            <div>
              <h3 className="text-md sm:text-lg font-medium text-gray-900 mb-3 flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" /> Select Date
              </h3>
              
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={goToPreviousDates}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FaChevronLeft className="text-gray-600" />
                </button>
                
                <span className="text-sm font-medium">
                  {currentViewStartDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                
                <button
                  type="button"
                  onClick={goToNextDates}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FaChevronRight className="text-gray-600" />
                </button>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 sm:gap-3">
                {getDates().map((date, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedDate(date.date)}
                    className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg border ${
                      selectedDate === date.date
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-medium">{date.day}</span>
                    <span className="text-sm sm:text-base font-bold">{date.date}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Time Selection */}
            <div>
              <h3 className="text-md sm:text-lg font-medium text-gray-900 mb-3 flex items-center">
                <FaClock className="mr-2 text-blue-500" /> Select Time
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
                {timeSlots.map((time, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 px-1 sm:px-3 text-center rounded-lg border text-xs sm:text-sm ${
                      selectedTime === time
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Patient Information */}
            <div>
              <h3 className="text-md sm:text-lg font-medium text-gray-900 mb-3">Patient Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Reason for Visit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Please describe your symptoms or reason for consultation"
              ></textarea>
            </div>
            
            {/* File Upload */}
            <div>
              <h3 className="text-md sm:text-lg font-medium text-gray-900 mb-3">Upload Medical Records (Optional)</h3>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <FaUpload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Drag and drop files here, or click to select files</p>
                <p className="text-xs text-gray-400 mt-1">Supported formats: PDF, JPG, PNG (Max 5MB)</p>
              </div>
              
              {/* Display uploaded files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h4>
                  <ul className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                        <span className="text-sm truncate max-w-xs">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTimes />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <Link href="/user/doctors">
                <button type="button" className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Book Appointment
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}