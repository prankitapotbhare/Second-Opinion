"use client";

import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components";
import HeroSection from "./components/HeroSection";
import DoctorsSection from "./components/DoctorsSection";
import FAQSection from "./components/FAQSection";
import { Footer } from "@/components";

export default function Home() {
  // Add client-side only rendering state
  const [isClient, setIsClient] = useState(false);
  // Create a ref for the FAQ section
  const faqRef = useRef(null);

  // Set isClient to true when component mounts on client
  useEffect(() => {
    setIsClient(true);

    // Check if URL has #faqs hash and scroll to FAQ section
    if (window.location.hash === '#faqs' && faqRef.current) {
      faqRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Function to scroll to FAQ section
  const scrollToFAQs = () => {
    if (faqRef.current) {
      faqRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e6f5f5]">
      <Navbar scrollToFAQs={scrollToFAQs} />
      {/* Only render interactive components when on client */}
      {isClient ? (
        <>
          <HeroSection />
          <DoctorsSection />
          <div ref={faqRef}>
            <FAQSection />
          </div>
        </>
      ) : (
        // Simple loading state or skeleton for SSR
        <div className="flex-grow flex items-center justify-center h-screen">
          <div className="p-4">Loading content...</div>
        </div>
      )}
      <Footer />
    </div>
  );
}
