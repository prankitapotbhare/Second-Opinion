"use client";

import React from 'react';

export default function DoctorLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}