"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
// Assuming doctors data includes all fields from the image
import { doctors } from '@/data/staticData'; // Or your API fetch logic
import { LoadingSpinner } from '@/components';
import Link from 'next/link';
// Removed inline icon imports as they are now in child components

// Import new or modified components from their files
import DoctorHeader from '../components/DoctorHeader';
import ProfessionalDetails from '../components/ProfessionalDetails';
import AboutSection from '../components/AboutSection';
import PatientReviewsCarousel from '../components/PatientReviewsCarousel';

export default function DoctorProfilePage() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- Fetch Doctor Data ---
    // Replace with your actual API call or data fetching logic
    // Ensure the fetched 'foundDoctor' object has all fields from the image:
    // name, photoURL, specialization, degree, experience, hospitalAffiliation,
    // qualification, license, licenseVerified, awards, languages, availability,
    // consultOptions, rating, reviewCount, address, about, reviews (array)
    const foundDoctor = doctors.find(doc => doc.id === id);

    // --- Mock Data Augmentation (Remove this when using real data) ---
    if (foundDoctor) {
        // Add mock data based on the image for demonstration
        const mockDetails = {
            photoURL: foundDoctor.photoURL || "https://via.placeholder.com/150", // Placeholder image
            degree: foundDoctor.degree || 'M.B.B.S',
            hospitalAffiliation: 'Fortis Hospital, Mumbai',
            qualification: 'DM (Interventional Cardiology), Johns Hopkins University',
            license: 'MCI No: 123456789',
            licenseVerified: true,
            awards: ['Excellence in Cardiac Care – 2021 (Fortis Healthcare)'],
            languages: ['English', 'Hindi', 'Marathi'],
            availability: 'Mon – Sat, 10:00 AM – 6:00 PM',
            consultOptions: ['Video Call', 'Chat', 'In-Person Visit'],
            rating: 4.9,
            reviewCount: 500,
            address: 'Fortis Hospital, Bandra West, Mumbai',
            about: `Dr. ${foundDoctor.name || 'Sunil Kumar'} is a dedicated Cardiologist with over ${foundDoctor.experience || '4.5'} years of experience in diagnosing and treating a wide range of heart conditions. He currently practices at Fortis Hospital, Mumbai, where he has established himself as a trusted healthcare provider known for his patient-centered approach and clinical excellence.\n\nAfter completing his M.B.B.S, Dr. Kumar pursued specialized training in Interventional Cardiology from Johns Hopkins University, where he gained extensive knowledge in advanced cardiac procedures and treatments. His educational background and continuous professional development have equipped him with the skills necessary to address complex cardiovascular issues with precision and care.`,
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
    // --- End Mock Data Augmentation ---

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
        <Link href="/user/doctors" className="text-teal-600 hover:text-teal-700 font-medium px-6 py-2 rounded-lg border border-teal-600 hover:bg-teal-50 transition-colors duration-200">
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
