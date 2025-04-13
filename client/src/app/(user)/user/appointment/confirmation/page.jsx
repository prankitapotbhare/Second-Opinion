"use client";

import React from 'react';
import ConfirmationMessage from '@/components/common/ConfirmationMessage';

export default function AppointmentConfirmation() {
  const appointmentDetails = [
    { label: "Appointment ID", value: "APT-12345" },
    { label: "Doctor", value: "Dr. Emily Johnson" },
    { label: "Date", value: "April 15, 2023" },
    { label: "Time", value: "10:30 AM" }
  ];

  return (
    <ConfirmationMessage
      title="Appointment Confirmed!"
      message="Your appointment has been successfully booked. You will receive a confirmation email with all the details."
      details={appointmentDetails}
      primaryButtonText="Return to Home"
      primaryButtonLink="/"
      secondaryButtonText="Go to Dashboard"
      secondaryButtonLink="/user/dashboard"
    />
  );
}