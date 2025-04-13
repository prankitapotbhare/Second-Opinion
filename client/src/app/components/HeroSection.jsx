"use client";
import { useState, useRef, useEffect } from "react";
import { departments } from "@/data/staticData";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

export default function HeroSection() {
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");
  const [showDepartments, setShowDepartments] = useState(false);
  const [mounted, setMounted] = useState(false);
  const departmentRef = useRef();

  useOnClickOutside(departmentRef, () => setShowDepartments(false));
  
  // Set mounted to true after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // If not mounted yet, return a placeholder with the same structure
  if (!mounted) {
    return (
      <section className="relative overflow-hidden py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 z-10">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Get Trusted Medical Second Opinions
              </h1>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Expert advice, Trusted decision!</h2>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Placeholder elements */}
                <div className="relative h-[42px] bg-white rounded-md"></div>
                <div className="relative h-[42px] bg-white rounded-md"></div>
                <div className="bg-teal-600 text-white px-6 py-3 rounded-md whitespace-nowrap">
                  Find Doctors
                </div>
              </div>
            </div>
            <div className="md:w-1/2 relative mt-10 md:mt-0">
              <div className="bg-teal-100 rounded-full h-80 w-80 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden py-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Get Trusted Medical Second Opinions
            </h1>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Expert advice, Trusted decision!</h2>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <i className="fas fa-map-marker-alt text-gray-400"></i>
                </span>
                <input
                  type="text"
                  placeholder="Enter your city or pin code"
                  className="pl-10 pr-4 py-3 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="relative" ref={departmentRef}>
                <div
                  className="w-full flex items-center justify-between pl-4 pr-3 py-3 bg-white rounded-md border border-gray-300 cursor-pointer"
                  onClick={() => setShowDepartments(!showDepartments)}
                >
                  <span
                    className={`text-sm ${department ? "text-gray-800" : "text-gray-400"}`}
                  >
                    {department || "Select Department"}
                  </span>
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
                {showDepartments && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-10">
                    {departments.map((dept, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-teal-50 cursor-pointer text-sm"
                        onClick={() => {
                          setDepartment(dept);
                          setShowDepartments(false);
                        }}
                      >
                        {dept}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-md whitespace-nowrap cursor-pointer">
                <i className="fas fa-user-md mr-2"></i>
                Find Doctors
              </button>
            </div>
          </div>
          <div className="md:w-1/2 relative mt-10 md:mt-0">
            <div className="relative">
              <div className="bg-teal-100 rounded-full h-80 w-80 mx-auto overflow-hidden">
                <img
                  src="https://readdy.ai/api/search-image?query=Professional%20male%20doctor%20in%20white%20coat%20with%20stethoscope%20smiling%20confidently%20holding%20clipboard%2C%20standing%20against%20light%20teal%20background%2C%20high%20quality%20portrait%20with%20clean%20medical%20professional%20appearance%2C%20friendly%20approachable%20healthcare%20provider&width=500&height=500&seq=7&orientation=portrait"
                  alt="Doctor"
                  className="object-cover w-full h-full object-top"
                />
              </div>
              <div className="absolute -top-4 right-10 bg-white py-2 px-4 rounded-lg shadow-md">
                <div className="flex items-center text-sm">
                  <i className="fas fa-calendar-check text-teal-500 mr-2"></i>
                  <span>Easy Appointment Booking</span>
                </div>
              </div>
              <div className="absolute bottom-4 left-0 bg-white py-2 px-4 rounded-lg shadow-md">
                <div className="flex items-center text-sm">
                  <i className="fas fa-clipboard-check text-teal-500 mr-2"></i>
                  <span>Get Your Second Opinion Today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}