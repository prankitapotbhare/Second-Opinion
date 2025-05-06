import React, { useEffect, useState } from 'react';
import { useDoctor } from '@/contexts/DoctorContext';
import { showSuccessToast, showErrorToast } from '@/utils/toast';

const defaultWorkingDays = {
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
  sunday: false,
};

const AvailabilitySection = () => {
  const { availability, fetchAvailability, setAvailability, loading } = useDoctor();
  const [form, setForm] = useState({
    workingDays: { ...defaultWorkingDays },
    startTime: '09:00',
    endTime: '17:00',
    weeklyHoliday: 'sunday',
    maxAppointmentsPerDay: 10,
    appointmentDuration: 30,
    bufferTime: 10,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, []);

  useEffect(() => {
    if (availability) {
      setForm({
        ...form,
        ...availability,
        workingDays: { ...defaultWorkingDays, ...availability.workingDays }
      });
    }
    // eslint-disable-next-line
  }, [availability]);

  const handleDayChange = (day) => {
    setForm((prev) => ({
      ...prev,
      workingDays: {
        ...prev.workingDays,
        [day]: !prev.workingDays[day],
      },
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await setAvailability(form);
      showSuccessToast('Availability updated!');
    } catch (err) {
      showErrorToast(err.message || 'Failed to update availability');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-100 mb-8">
      <h2 className="text-xl font-medium text-gray-800 mb-6">Availability / Working Hours</h2>
      <div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
          <div className="flex flex-wrap gap-4">
            {Object.keys(defaultWorkingDays).map((day) => (
              <label key={day} className="flex items-center capitalize">
                <input
                  type="checkbox"
                  checked={form.workingDays[day]}
                  onChange={() => handleDayChange(day)}
                  className="h-4 w-4 text-blue-600 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{day}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Holiday</label>
            <select
              name="weeklyHoliday"
              value={form.weeklyHoliday}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              {Object.keys(defaultWorkingDays).map((day) => (
                <option key={day} value={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Appointments/Day</label>
            <input
              type="number"
              name="maxAppointmentsPerDay"
              value={form.maxAppointmentsPerDay}
              onChange={handleChange}
              min={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Duration (min)</label>
            <input
              type="number"
              name="appointmentDuration"
              value={form.appointmentDuration}
              onChange={handleChange}
              min={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Buffer Time (min)</label>
          <input
            type="number"
            name="bufferTime"
            value={form.bufferTime}
            onChange={handleChange}
            min={0}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="button"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={isSubmitting || loading}
          onClick={handleSubmit}
        >
          {isSubmitting || loading ? 'Saving...' : 'Save Availability'}
        </button>
      </div>
    </section>
  );
};

export default AvailabilitySection;