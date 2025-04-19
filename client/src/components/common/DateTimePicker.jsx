"use client";

import React, { useState } from 'react';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';

const DateTimePicker = ({ onSelect, onClose }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const timeSlots = [
    '09:00 A.M', '10:00 A.M', '11:00 A.M',
    '01:00 P.M', '02:00 P.M', '03:00 P.M',
    '05:00 P.M', '06:00 P.M', '07:00 P.M',
    '08:00 P.M', '10:00 P.M', '11:00 P.M'
  ];

  const handleSubmit = () => {
    if (selectedDate && selectedTime) {
      onSelect({ date: selectedDate, time: selectedTime });
    }
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        {/* Time Picker */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Picker</label>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
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
        
        {/* Send Response Button */}
        <div className="flex justify-end">
          <button
            type="button"
            className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 flex items-center"
            onClick={handleSubmit}
            disabled={!selectedDate || !selectedTime}
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