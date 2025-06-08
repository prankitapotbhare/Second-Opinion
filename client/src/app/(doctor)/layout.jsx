"use client";

import React, { useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { DoctorProvider, useDoctor } from '@/contexts/DoctorContext';
import { usePathname, useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components';

function DoctorAccessGuard({ children }) {
  const { doctor, loading } = useDoctor();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (doctor && doctor.isProfileComplete === false && !pathname.startsWith('/doctor/portal')) {
      router.replace('/doctor/portal');
    }
    if (doctor && doctor.isProfileComplete === true && pathname.startsWith('/doctor/portal')) {
      router.replace('/doctor/dashboard');
    }
  }, [doctor, loading, pathname, router]);

  return children;
}

export default function DoctorLayout({ children }) {
  return (
    <DoctorProvider>
      <ProtectedRoute allowedRoles={['doctor']} redirectTo="/login/doctor">
        <DoctorAccessGuard>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </DoctorAccessGuard>
      </ProtectedRoute>
    </DoctorProvider>
  );
}