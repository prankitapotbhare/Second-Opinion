"use client";

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { DoctorProvider } from '@/contexts/DoctorContext';

export default function DoctorLayout({ children }) {
  return (
    <DoctorProvider>
      <ProtectedRoute allowedRoles={['doctor']} redirectTo="/login/doctor">
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
      </ProtectedRoute>
    </DoctorProvider>
  );
}