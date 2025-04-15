import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaUser, FaPhone, FaEnvelope, FaFileAlt } from 'react-icons/fa';

const AppointmentBookingForm = ({ doctorId, doctorName, specialization }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    appointmentType: 'video',
    appointmentDate: '',
    appointmentTime: '',
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    reason: '',
    symptoms: '',
    previousTreatment: '',
    additionalNotes: ''
  });
  
  // Mock available time slots
  const availableTimeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', 
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNext = () => {
    setStep(prev => prev + 1);
  };
  
  const handlePrevious = () => {
    setStep(prev => prev - 1);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Appointment booking data:', formData);
    
    // For demo purposes, just move to confirmation step
    setStep(4);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Progress Steps */}
      <div className="bg-gray-50 px-6 py-4">
        <div className="flex justify-between">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
              step >= 1 ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <span className="text-xs mt-1">Type</span>
          </div>
          <div className="flex-1 flex items-center">
            <div className={`h-1 w-full ${step >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
          </div>
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
              step >= 2 ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <span className="text-xs mt-1">Schedule</span>
          </div>
          <div className="flex-1 flex items-center">
            <div className={`h-1 w-full ${step >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
          </div>
          <div className={`flex flex-col items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
              step >= 3 ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
            <span className="text-xs mt-1">Details</span>
          </div>
          <div className="flex-1 flex items-center">
            <div className={`h-1 w-full ${step >= 4 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
          </div>
          <div className={`flex flex-col items-center ${step >= 4 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
              step >= 4 ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'
            }`}>
              4
            </div>
            <span className="text-xs mt-1">Confirm</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Book an Appointment</h2>
          <p className="text-gray-600">
            {doctorName ? `with Dr. ${doctorName}` : 'with a Specialist'}
            {specialization && ` - ${specialization}`}
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Step 1: Appointment Type */}
          {step === 1 && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Select Appointment Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <label className={`border rounded-lg p-4 cursor-pointer ${
                  formData.appointmentType === 'video' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="appointmentType"
                    value="video"
                    checked={formData.appointmentType === 'video'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Video Consultation</h4>
                      <p className="text-sm text-gray-600">Consult with the doctor via video call</p>
                      <p className="text-sm font-medium text-blue-600 mt-2">₹1200</p>
                    </div>
                  </div>
                </label>
                
                <label className={`border rounded-lg p-4 cursor-pointer ${
                  formData.appointmentType === 'in-person' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="appointmentType"
                    value="in-person"
                    checked={formData.appointmentType === 'in-person'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">In-Person Visit</h4>
                      <p className="text-sm text-gray-600">Visit the doctor at the clinic</p>
                      <p className="text-sm font-medium text-green-600 mt-2">₹1500</p>
                    </div>
                  </div>
                </label>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}
          
          {/* Step 2: Schedule */}
          {step === 2 && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Select Date & Time</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaCalendarAlt className="inline mr-2" />
                  Appointment Date
                </label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              {formData.appointmentDate && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaClock className="inline mr-2" />
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableTimeSlots.map((time, index) => (
                      <label
                        key={index}
                        className={`border rounded-md p-2 text-center text-sm cursor-pointer ${
                          formData.appointmentTime === time ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="appointmentTime"
                          value={time}
                          checked={formData.appointmentTime === time}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        {time}
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!formData.appointmentDate || !formData.appointmentTime}
                  className={`px-6 py-2 rounded-md ${
                    formData.appointmentDate && formData.appointmentTime
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
          
          {/* Step 3: Patient Details */}
          {step === 3 && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Patient Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaUser className="inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaPhone className="inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="patientPhone"
                    value={formData.patientPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaEnvelope className="inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="patientEmail"
                    value={formData.patientEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaFileAlt className="inline mr-2" />
                    Reason for Visit
                  </label>
                  <input
                    type="text"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Symptoms
                  </label>
                  <textarea
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Please describe your symptoms"
                  ></textarea>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Previous Treatment (if any)
                  </label>
                  <textarea
                    name="previousTreatment"
                    value={formData.previousTreatment}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any previous treatments or medications"
                  ></textarea>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any additional information you'd like to share"
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          )}
          
          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">Appointment Booked Successfully!</h3>
                <p className="text-gray-600">Your appointment has been confirmed.</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-800 mb-3">Appointment Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Appointment Type</p>
                    <p className="font-medium text-gray-800">
                      {formData.appointmentType === 'video' ? 'Video Consultation' : 'In-Person Visit'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Doctor</p>
                    <p className="font-medium text-gray-800">{doctorName || 'Specialist'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-gray-800">{formData.appointmentDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium text-gray-800">{formData.appointmentTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Patient</p>
                    <p className="font-medium text-gray-800">{formData.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium text-gray-800">{formData.patientPhone}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Important Information</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>A confirmation email has been sent to {formData.patientEmail}</li>
                        <li>Please arrive 15 minutes before your scheduled appointment time</li>
                        <li>Bring any relevant medical records or test results</li>
                        <li>You can reschedule or cancel your appointment up to 24 hours before</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => window.location.href = '/user/dashboard'}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Go to Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Print Details
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AppointmentBookingForm;