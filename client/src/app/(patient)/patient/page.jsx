"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/patient/doctors');
  }, [router]);
  
  return null;
}