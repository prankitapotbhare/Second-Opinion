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
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="relative overflow-hidden py-6 sm:py-10 md:py-14 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 z-10">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">
                Get Trusted Medical Second Opinions
              </h1>
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6 lg:mb-8">
                Expert advice, Trusted decision!
              </h2>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
                <div className="relative h-[42px] bg-white rounded-md"></div>
                <div className="relative h-[42px] bg-white rounded-md"></div>
                <div className="bg-teal-600 text-white h-[42px] flex items-center justify-center px-3 sm:px-4 md:px-6 rounded-md whitespace-nowrap">
                  Find Doctors
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 relative mt-6 md:mt-0 flex justify-center">
              <div className="bg-teal-100 rounded-full h-52 w-52 sm:h-60 sm:w-60 md:h-72 md:w-72 lg:h-80 lg:w-80"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden py-6 sm:py-10 md:py-14 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 hidden lg:block">
          <div className="w-48 h-48 xl:w-64 xl:h-64 rounded-full bg-teal-50 opacity-70"></div>
        </div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 hidden lg:block">
          <div className="w-48 h-48 xl:w-64 xl:h-64 rounded-full bg-teal-50 opacity-70"></div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-4 lg:gap-8">
          {/* Left content - Text and search */}
          <div className="w-full md:w-1/2 z-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">
              Get Trusted Medical Second Opinions
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6 lg:mb-8">
              Expert advice, Trusted decision!
            </h2>
            
            {/* Search inputs - Stack on mobile, row on larger screens */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
              <div className="relative flex-grow">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 pointer-events-none">
                  <i className="fas fa-map-marker-alt text-gray-400 text-xs sm:text-sm"></i>
                </span>
                <input
                  type="text"
                  placeholder="Enter your city or pin code"
                  className="pl-7 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm shadow-sm"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              <div className="relative flex-grow" ref={departmentRef}>
                <div
                  className="w-full flex items-center justify-between pl-3 sm:pl-4 pr-2 sm:pr-3 py-2 sm:py-3 bg-white rounded-md border border-gray-300 cursor-pointer shadow-sm"
                  onClick={() => setShowDepartments(!showDepartments)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={showDepartments}
                  aria-haspopup="listbox"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setShowDepartments(!showDepartments);
                    }
                  }}
                >
                  <span
                    className={`text-xs sm:text-sm ${department ? "text-gray-800" : "text-gray-400"}`}
                  >
                    {department || "Select Department"}
                  </span>
                  <i className={`fas fa-chevron-${showDepartments ? 'up' : 'down'} text-gray-400 text-xs sm:text-sm transition-transform duration-200`}></i>
                </div>
                
                {showDepartments && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-20 max-h-40 sm:max-h-60 overflow-y-auto">
                    {departments.map((dept, index) => (
                      <div
                        key={index}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-teal-50 cursor-pointer text-xs sm:text-sm transition-colors duration-150"
                        onClick={() => {
                          setDepartment(dept);
                          setShowDepartments(false);
                        }}
                        role="option"
                        aria-selected={department === dept}
                      >
                        {dept}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <button 
                className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 sm:py-3 px-3 sm:px-4 md:px-6 rounded-md whitespace-nowrap cursor-pointer transition-colors duration-200 shadow-sm flex items-center justify-center text-xs sm:text-sm"
                aria-label="Find Doctors"
              >
                <i className="fas fa-user-md mr-1.5 sm:mr-2"></i>
                <span>Find Doctors</span>
              </button>
            </div>
            
            {/* Additional features - Hidden on small screens, responsive on larger */}
            <div className="hidden sm:flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center">
                <i className="fas fa-check-circle text-teal-500 mr-1.5 sm:mr-2"></i>
                <span>Verified Specialists</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-shield-alt text-teal-500 mr-1.5 sm:mr-2"></i>
                <span>Secure Consultations</span>
              </div>
            </div>
          </div>
          
          {/* Right content - Image */}
          <div className="w-full md:w-1/2 relative mt-6 md:mt-0">
            <div className="relative flex justify-center">
              {/* Main image container */}
              <div className="bg-teal-100 rounded-full h-52 w-52 sm:h-60 sm:w-60 md:h-72 md:w-72 lg:h-80 lg:w-80 overflow-hidden shadow-xl">
                <img
                  src="https://readdy.ai/api/search-image?query=Professional%20male%20doctor%20in%20white%20coat%20with%20stethoscope%20smiling%20confidently%20holding%20clipboard%2C%20standing%20against%20light%20teal%20background%2C%20high%20quality%20portrait%20with%20clean%20medical%20professional%20appearance%2C%20friendly%20approachable%20healthcare%20provider&width=500&height=500&seq=7&orientation=portrait"
                  alt="Doctor"
                  className="object-cover w-full h-full object-top"
                  loading="eager"
                />
              </div>
              
              {/* Floating info cards - Responsive positioning and sizing */}
              <div className="absolute -top-3 sm:-top-4 right-2 sm:right-6 md:right-10 lg:right-16 bg-white py-1.5 sm:py-2 px-2 sm:px-3 md:px-4 rounded-lg shadow-md transform hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center text-[10px] xs:text-xs sm:text-sm whitespace-nowrap">
                  <i className="fas fa-calendar-check text-teal-500 mr-1 sm:mr-1.5 md:mr-2"></i>
                  <span>Easy Appointment Booking</span>
                </div>
              </div>
              
              <div className="absolute bottom-3 sm:bottom-4 left-2 sm:left-6 md:left-0 bg-white py-1.5 sm:py-2 px-2 sm:px-3 md:px-4 rounded-lg shadow-md transform hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center text-[10px] xs:text-xs sm:text-sm whitespace-nowrap">
                  <i className="fas fa-clipboard-check text-teal-500 mr-1 sm:mr-1.5 md:mr-2"></i>
                  <span>Get Your Second Opinion Today</span>
                </div>
              </div>
              
              {/* Additional floating element - Only visible on larger screens */}
              <div className="absolute -bottom-2 right-0 bg-white py-1.5 sm:py-2 px-2 sm:px-3 md:px-4 rounded-lg shadow-md hidden sm:flex items-center transform hover:-translate-y-1 transition-transform duration-300">
                <i className="fas fa-star text-yellow-400 mr-1 sm:mr-1.5 md:mr-2 text-xs sm:text-sm"></i>
                <span className="text-[10px] xs:text-xs sm:text-sm">Top Rated Specialists</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}