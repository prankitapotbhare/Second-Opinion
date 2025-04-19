"use client";

import React from 'react';
import { usePatient } from '@/contexts/PatientContext';
import { useRouter } from 'next/navigation';

export default function TestPage() {
  const { setSubmission, clearSubmission } = usePatient();
  const router = useRouter();

  const testScenarios = [
    {
      name: "Existing Patient (No Second Opinion)",
      action: () => {
        setSubmission({ id: 'sub_123456789' });
        router.push('/user/response');
      }
    },
    {
      name: "Existing Patient (Needs Second Opinion)",
      action: () => {
        setSubmission({ id: 'sub_987654321' });
        router.push('/user/response');
      }
    },
    {
      name: "New Submission",
      action: () => {
        clearSubmission();
        router.push('/user/patient-details?doctorId=1');
      }
    },
    {
      name: "Clear Session",
      action: () => {
        clearSubmission();
        router.push('/user/doctors');
      }
    }
  ];

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Test Scenarios</h1>
          
          <div className="space-y-4">
            {testScenarios.map((scenario, index) => (
              <button
                key={index}
                onClick={scenario.action}
                className="w-full px-4 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
              >
                {scenario.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}