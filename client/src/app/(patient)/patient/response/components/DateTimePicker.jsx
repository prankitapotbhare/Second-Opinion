"use client";

import React, { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { usePatient } from '@/contexts/PatientContext';

const DateTimePicker = ({ onSelect, onClose, doctorId }) => {
  // Format today's date as YYYY-MM-DD for initial state
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState('');
  const [fetchTrigger, setFetchTrigger] = useState(0); // Add this to force re-fetch
  
  const { 
    availableSlots, 
    slotsLoading, 
    slotsError, 
    fetchAvailableSlots,
    patientResponse
  } = usePatient();

  // Log props when component mounts
  useEffect(() => {
    console.log('DateTimePicker mounted with doctorId prop:', doctorId);
    console.log('PatientResponse:', patientResponse);
    console.log('PatientResponse doctorId:', patientResponse?.doctorId);
  }, [doctorId, patientResponse]);

  // Fetch available slots when component mounts and when date changes
  useEffect(() => {
    // Use the doctorId from props or from patientResponse
    const doctor = doctorId || (patientResponse && patientResponse.doctorId);
    
    console.log('Attempting to fetch slots with doctor ID:', doctor);
    
    if (doctor) {
      console.log('Fetching slots for doctor:', doctor, 'date:', selectedDate);
      fetchAvailableSlots(doctor, selectedDate);
    } else {
      console.error('No doctor ID available for fetching slots');
    }
  }, [selectedDate, doctorId, patientResponse, fetchAvailableSlots, fetchTrigger]);

  // Debug logs for state changes
  useEffect(() => {
    console.log('Current available slots:', availableSlots);
    console.log('Slots loading:', slotsLoading);
    console.log('Slots error:', slotsError);
  }, [availableSlots, slotsLoading, slotsError]);

  const handleSubmit = () => {
    if (selectedDate && selectedTime) {
      // Convert time format back to 24-hour for API (e.g., "09:00 A.M" to "09:00")
      const timeValue = selectedTime.split(' ')[0];
      const period = selectedTime.split(' ')[1];
      
      let [hours, minutes] = timeValue.split(':').map(Number);
      
      if (period === 'P.M' && hours < 12) {
        hours += 12;
      } else if (period === 'A.M' && hours === 12) {
        hours = 0;
      }
      
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      console.log('Submitting date:', selectedDate, 'time:', formattedTime);
      onSelect({ 
        date: selectedDate, 
        time: formattedTime 
      });
    }
  };

  const handleRetry = () => {
    // Force a re-fetch of the slots
    setFetchTrigger(prev => prev + 1);
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-center mb-6">Choose Date and Time</h2>
        
        {/* Date Picker */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Picker</label>
          <div className="relative">
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
              value={selectedDate}
              onChange={(e) => {
                const newDate = e.target.value;
                console.log('Date changed to:', newDate);
                setSelectedDate(newDate);
                setSelectedTime(''); // Reset time when date changes
              }}
              min={today}
              required
            />
          </div>
        </div>
        
        {/* Time Picker */}
        <div className="mb-6">
          <label className="flex text-sm font-medium text-gray-700 mb-2 justify-between items-center">
            <span>
              Available Time Slots
              {slotsLoading && <FaSpinner className="inline-block ml-2 animate-spin text-teal-600" />}
            </span>
            <button 
              onClick={handleRetry} 
              className="text-xs text-teal-600 hover:underline"
              type="button"
            >
              Refresh
            </button>
          </label>
          
          {slotsError && (
            <div className="text-red-500 text-sm mb-2">
              Error loading available slots: {slotsError}
            </div>
          )}
          
          {!slotsLoading && availableSlots.length === 0 && (
            <div className="text-amber-600 text-sm mb-2">
              No available slots for this date. Please select another date.
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
            {availableSlots.map((time, index) => (
              <button
                key={`${time}-${index}`}
                type="button"
                className={`py-2 px-2 border rounded-md text-sm ${
                  selectedTime === time
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'border-gray-300 hover:border-teal-500'
                }`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>
        
        {/* Actions */}
        <div className="flex justify-between">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 flex items-center"
            onClick={handleSubmit}
            disabled={!selectedDate || !selectedTime || slotsLoading}
          >
            Send Response
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;