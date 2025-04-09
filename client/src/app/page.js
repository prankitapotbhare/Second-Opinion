"use client";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import DoctorsSection from "./components/DoctorsSection";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <DoctorsSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
