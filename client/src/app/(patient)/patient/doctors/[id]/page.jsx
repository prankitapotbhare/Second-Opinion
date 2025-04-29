"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
// Update the import to use the consolidated data
import { doctors as doctorsData } from '@/data/doctorsData';
import { LoadingSpinner } from '@/components';
import Link from 'next/link';

// Import components from their files
import DoctorHeader from '../components/DoctorHeader';
import ProfessionalDetails from '../components/ProfessionalDetails';
import AboutSection from '../components/AboutSection';
import PatientReviewsCarousel from '../components/PatientReviewsCarousel';

export default function DoctorProfilePage() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find doctor using the consolidated data
    const foundDoctor = doctorsData.find(doc => doc.id === id);

    // Mock Data Augmentation (Remove this when using real data)
    if (foundDoctor) {
        // Add mock data based on the image for demonstration
        const mockDetails = {
            specialization: foundDoctor.specialization,
            imageUrl: foundDoctor.imageUrl || "https://via.placeholder.com/150",
            degree: foundDoctor.qualification || 'M.B.B.S',
            hospitalAffiliation: foundDoctor.hospitalAffiliation || 'Fortis Hospital, Mumbai',
            qualification: foundDoctor.qualification || 'DM (Interventional Cardiology), Johns Hopkins University',
            license: 'MCI No: 123456789',
            licenseVerified: true,
            awards: ['Excellence in Cardiac Care – 2021 (Fortis Healthcare)'],
            languages: ['English', 'Hindi', 'Marathi'],
            availability: 'Mon – Sat, 10:00 AM – 6:00 PM',
            consultOptions: ['Response', 'In-Person Visit'],
            rating: foundDoctor.rating || 4.9,
            reviewCount: foundDoctor.reviewCount || 500,
            address: foundDoctor.location || 'Fortis Hospital, Bandra West, Mumbai',
            about: `Dr. ${foundDoctor.name} is a dedicated ${foundDoctor.specialization} with over ${foundDoctor.experience} of experience in diagnosing and treating a wide range of conditions. ${foundDoctor.hospitalAffiliation ? `They currently practice at ${foundDoctor.hospitalAffiliation}` : ''}, where they have established themselves as a trusted healthcare provider known for their patient-centered approach and clinical excellence.\n\nAfter completing their ${foundDoctor.qualification}, Dr. ${foundDoctor.name.split(' ')[1] || foundDoctor.name.split(' ')[0]} gained extensive knowledge in advanced procedures and treatments. Their educational background and continuous professional development have equipped them with the skills necessary to address complex issues with precision and care.`,
            reviews: [
                { id: 1, name: 'Amit Verma', text: 'Very professional, explained everything.' },
                { id: 2, name: 'Priya Malhotra', text: 'Saved me from unnecessary surgery.' },
                { id: 3, name: 'Rahul Mehta', text: 'Quick and knowledgeable.' },
                { id: 4, name: 'Sneha Patil', text: 'Great doctor, highly recommend.' },
                { id: 5, name: 'Vikram Singh', text: 'Listened patiently to my concerns.' },
            ]
        };
        setDoctor({ ...foundDoctor, ...mockDetails });
    }
    // End Mock Data Augmentation

    setLoading(false);
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Doctor Not Found</h1>
        <p className="text-gray-600 mb-6">We couldn't find the doctor profile you were looking for.</p>
        <Link href="/patient/doctors" className="text-teal-600 hover:text-teal-700 font-medium px-6 py-2 rounded-lg border border-teal-600 hover:bg-teal-50 transition-colors duration-200">
          Browse Other Doctors
        </Link>
      </div>
    );
  }

  // --- Main Page Structure ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* 1. Header Section */}
        <DoctorHeader doctor={doctor} />

        {/* 2. Professional Details Section */}
        <ProfessionalDetails doctor={doctor} />

        {/* 3. About Section */}
        <AboutSection doctor={doctor} />

        {/* 4. Patient Reviews Section */}
        <PatientReviewsCarousel reviews={doctor.reviews} />

      </div>
    </div>
  );
}

// --- Removed Inline Helper Components ---
// They are now in separate files within the ./components directory
