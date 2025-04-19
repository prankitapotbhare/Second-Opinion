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
  const [currentDate, setCurrentDate] = useState(new Date());
  
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
    const today = new Date();
    setSelectedDate(today.getDate());
    
    // Initialize currentViewStartDate to today for current month view
    const viewStartDate = new Date(currentDate);
    if (currentDate.getMonth() === today.getMonth() && 
        currentDate.getFullYear() === today.getFullYear()) {
      viewStartDate.setDate(today.getDate());
    } else {
      viewStartDate.setDate(1);
    }
    setCurrentViewStartDate(viewStartDate);
  }, [doctorId, currentDate, router]);
  
  // Add state to track the current view's start date
  const [currentViewStartDate, setCurrentViewStartDate] = useState(new Date());
  
  const getDates = () => {
    const dates = [];
    
    // Start from the currentViewStartDate
    const startingDate = new Date(currentViewStartDate);
    
    // Get the last day of the month
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    
    // Calculate how many days to show (up to 7 at a time)
    const daysToShow = Math.min(7, lastDay - startingDate.getDate() + 1);
    
    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(startingDate);
      date.setDate(startingDate.getDate() + i);
      dates.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear()
      });
    }
    return dates;
  };
  
  // Navigate to previous set of dates
  const goToPreviousDates = () => {
    const today = new Date();
    const isCurrentMonth = currentDate.getMonth() === today.getMonth() && 
                           currentDate.getFullYear() === today.getFullYear();
    
    // Calculate new start date
    const newStartDate = new Date(currentViewStartDate);
    newStartDate.setDate(Math.max(newStartDate.getDate() - 7, isCurrentMonth ? today.getDate() : 1));
    
    setCurrentViewStartDate(newStartDate);
    setSelectedDate(null);
  };
  
  // Navigate to next set of dates
  const goToNextDates = () => {
    const newStartDate = new Date(currentViewStartDate);
    
    // Get the last day of the current month
    const lastDay = new Date(newStartDate.getFullYear(), newStartDate.getMonth() + 1, 0).getDate();
    
    // If adding 7 days would exceed the month, stop at the last day
    if (newStartDate.getDate() + 7 > lastDay) {
      // We've reached the end of the month
      return;
    }
    
    // Otherwise, advance by 7 days
    newStartDate.setDate(newStartDate.getDate() + 7);
    setCurrentViewStartDate(newStartDate);
    setSelectedDate(null);
  };
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    const today = new Date();
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    
    // Don't allow navigation to months before the current month
    if (prevMonth.getMonth() < today.getMonth() && prevMonth.getFullYear() <= today.getFullYear()) {
      return;
    }
    
    setCurrentDate(prevMonth);
    
    // Set the start date appropriately
    const newViewStartDate = new Date(prevMonth);
    if (prevMonth.getMonth() === today.getMonth() && 
        prevMonth.getFullYear() === today.getFullYear()) {
      // If navigating to current month, start from today
      newViewStartDate.setDate(today.getDate());
    } else {
      // Otherwise start from the 1st
      newViewStartDate.setDate(1);
    }
    
    setCurrentViewStartDate(newViewStartDate);
    setSelectedDate(null);
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentDate(nextMonth);
    
    // When changing to a new month, always start from the 1st
    const newViewStartDate = new Date(nextMonth);
    newViewStartDate.setDate(1);
    setCurrentViewStartDate(newViewStartDate);
    setSelectedDate(null);
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
    // Process form submission
    console.log({
      doctor: doctor?.name,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      gender,
      files: uploadedFiles.map(file => file.name)
    });
    
    // In a real app, you would send this data to your backend
    alert('Appointment booked successfully!');
    
    // Redirect to confirmation page or dashboard
    router.push('/user/dashboard');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Doctor Not Found</h1>
        <Link href="/user/doctors" className="text-green-600 hover:underline">
          Browse Other Doctors
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Doctor Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center">
            <div className="w-20 h-20 rounded-full overflow-hidden mr-6">
              <img
                src={doctor.imageUrl || "https://public.readdy.ai/ai/img_res/44c49570964d9978bef233f93cc1e776.jpg"}
                alt={doctor.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{doctor.name}</h1>
              <p className="text-lg text-green-600">{doctor.specialization || doctor.department}</p>
              <p className="text-gray-600">{doctor.qualification || doctor.degree} • {doctor.experience} experience</p>
            </div>
          </div>
        </div>
        
        {/* Appointment Booking Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Book Your Appointment</h2>
          
          <form id="patientForm" onSubmit={handleSubmit} className="space-y-8">
            {/* Date Selection */}
            <div>
              <h3 className="text-2xl font-medium text-gray-900 mb-4 text-center">Choose Date and Time</h3>
              
              {/* Month and Year Navigation */}
              <div className="flex justify-between items-center mb-4">
                <button 
                  type="button" 
                  onClick={goToPreviousMonth}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <h4 className="text-lg font-medium">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h4>
                <button 
                  type="button" 
                  onClick={goToNextMonth}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 relative">
                <button
                  type="button"
                  onClick={goToPreviousDates}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-4 p-2 rounded-full hover:bg-gray-100 z-10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {getDates().map((date, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedDate(date.date)}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                      selectedDate === date.date
                        ? 'bg-green-50 border-green-500 text-green-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-sm font-medium">{date.day}</span>
                    <span className="text-lg font-bold">{date.date}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(date.year, date.month, date.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </button>
                ))}
                
                <button
                  type="button"
                  onClick={goToNextDates}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-4 p-2 rounded-full hover:bg-gray-100 z-10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Time Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Available Time Slots</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {timeSlots.map((time, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 px-4 rounded-lg border ${
                      selectedTime === time
                        ? 'bg-green-50 border-green-500 text-green-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Patient Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="patientName"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="patientAge" className="block text-sm font-medium text-gray-700 mb-1">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="patientAge"
                    required
                    min="1"
                    max="120"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={gender === 'male'}
                        onChange={() => setGender('male')}
                        required
                        className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <span className="ml-2 text-gray-700">Male</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={gender === 'female'}
                        onChange={() => setGender('female')}
                        className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <span className="ml-2 text-gray-700">Female</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="other"
                        checked={gender === 'other'}
                        onChange={() => setGender('other')}
                        className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <span className="ml-2 text-gray-700">Other</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label htmlFor="patientPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="patientPhone"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="patientEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="patientEmail"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact Number
                  </label>
                  <input
                    type="tel"
                    id="emergencyContact"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="relationWithPatient" className="block text-sm font-medium text-gray-700 mb-1">
                    Relation with Patient
                  </label>
                  <select
                    id="relationWithPatient"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select relation</option>
                    <option value="self">Self</option>
                    <option value="parent">Parent</option>
                    <option value="child">Child</option>
                    <option value="spouse">Spouse</option>
                    <option value="sibling">Sibling</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
                    Describe Patient's Problem <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="symptoms"
                    rows="3"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  ></textarea>
                </div>
              </div>
            </div>
            
            {/* Medical Records Upload */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Medical Records</h3>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="space-y-2">
                  <div className="flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Drag and drop files here, or click to select files</p>
                  <p className="text-sm text-gray-500">Supported formats: PDF, JPG, PNG (Max 10MB)</p>
                  <div>
                    <label className="inline-block px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                      Browse Files
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>
                  </div>
                </div>
              </div>
              
              {/* File List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h4>
                  <ul className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
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
            
            {/* Form Actions */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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