"use client";

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import DoctorsSection from "./components/DoctorsSection";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";

export default function Home() {
  // Add client-side only rendering state
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#e6f5f5]">
      <Navbar />
      {/* Only render interactive components when on client */}
      {isClient ? (
        <>
          <HeroSection />
          <DoctorsSection />
          <FAQSection />
        </>
      ) : (
        // Simple loading state or skeleton for SSR
        <div className="flex-grow flex items-center justify-center">
          <div className="p-4">Loading content...</div>
        </div>
      )}
      <Footer />
    </div>
  );
}
