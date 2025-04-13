"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { doctors } from '@/data/staticData';
import Link from 'next/link';

export default function AppointmentBookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const doctorId = searchParams.get('doctorId');
  const appointmentType = searchParams.get('type') || 'in-person';
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Appointment booking states
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [gender, setGender] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [currentDate] = useState(new Date());
  
  useEffect(() => {
    if (!doctorId) {
      router.push('/user/doctors');
      return;
    }
    
    // Find the doctor based on the ID
    const foundDoctor = doctors.find(doc => doc.id === doctorId);
    if (foundDoctor) {
      setDoctor(foundDoctor);
    } else {
      // If doctor not found, redirect to doctors page
      router.push('/user/doctors');
      return;
    }
    
    setLoading(false);
    
    // Set default selected date to today
    setSelectedDate(currentDate.getDate());
  }, [doctorId, currentDate, router]);
  
  const getDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      dates.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear()
      });
    }
    return dates;
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
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, you would send this data to your backend
    const appointmentData = {
      doctorId,
      doctorName: doctor?.name,
      appointmentType,
      date: selectedDate,
      time: selectedTime,
      gender,
      files: uploadedFiles.map(file => file.name)
    };
    
    console.log('Appointment Data:', appointmentData);
    
    // Redirect to confirmation page
    router.push('/user/appointment/confirmation');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Doctor Not Found</h1>
        <Link href="/user/doctors" className="text-blue-600 hover:underline">
          Browse Other Doctors
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href={`/user/doctors/${doctorId}`} className="text-blue-600 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Doctor Profile
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Book an Appointment</h1>
            <p className="text-gray-600 mt-1">
              {appointmentType === 'video' ? 'Video Consultation' : 'In-Person Visit'} with {doctor.name}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {/* Date Selection */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-3">Select Date</h2>
              <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                {getDates().map((date, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`p-3 rounded-lg border ${
                      selectedDate === date.date
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-200 hover:border-blue-500'
                    } flex flex-col items-center`}
                    onClick={() => setSelectedDate(date.date)}
                  >
                    <span className="text-sm font-medium">{date.day}</span>
                    <span className="text-lg font-bold">{date.date}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Time Selection */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-3">Select Time</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {timeSlots.map((time, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`p-3 rounded-lg border ${
                      selectedTime === time
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-200 hover:border-blue-500'
                    } text-center`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Gender Selection */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-3">Gender</h2>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === 'male'}
                    onChange={() => setGender('male')}
                    className="h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Male</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === 'female'}
                    onChange={() => setGender('female')}
                    className="h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Female</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={gender === 'other'}
                    onChange={() => setGender('other')}
                    className="h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">Other</span>
                </label>
              </div>
            </div>
            
            {/* File Upload */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-3">Upload Medical Records (Optional)</h2>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-gray-700 mb-1">Drag and drop files here, or click to select files</p>
                <p className="text-sm text-gray-500">Supported formats: PDF, JPG, PNG (Max 5MB)</p>
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
              
              {/* Display uploaded files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-md font-medium text-gray-800 mb-2">Uploaded Files:</h3>
                  <ul className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={!selectedDate || !selectedTime || !gender}
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}