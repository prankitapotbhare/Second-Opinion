"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

// Mock API functions
const fetchLocations = () =>
  new Promise((resolve) =>
    setTimeout(() => resolve(["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata"]), 500)
  );
const fetchDepartments = () =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          "Cardiology",
          "Neurology",
          "Orthopedics",
          "Dermatology",
          "Pediatrics",
          "General Medicine",
        ]),
      500
    )
  );

export default function HeroSection() {
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");
  const [locations, setLocations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showDepartments, setShowDepartments] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [mounted, setMounted] = useState(false);
  const departmentRef = useRef();
  const locationRef = useRef();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    fetchLocations().then(setLocations);
    fetchDepartments().then(setDepartments);
  }, []);

  // Hide dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        departmentRef.current &&
        !departmentRef.current.contains(event.target)
      ) {
        setShowDepartments(false);
      }
      if (
        locationRef.current &&
        !locationRef.current.contains(event.target)
      ) {
        setShowLocations(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = [];
    if (location) params.push(`location=${encodeURIComponent(location)}`);
    if (department) params.push(`department=${encodeURIComponent(department)}`);
    const query = params.length ? `?${params.join("&")}` : "";
    router.push(`/user/doctors${query}`);
  };

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
            {/* Search Form */}
            <form
              className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6"
              onSubmit={handleSubmit}
            >
              {/* Location Dropdown */}
              <div className="relative flex-grow" ref={locationRef}>
                <input
                  type="text"
                  placeholder="Select Location"
                  className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={location}
                  onFocus={() => setShowLocations(true)}
                  readOnly
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400"
                  onClick={() => setShowLocations((v) => !v)}
                  tabIndex={-1}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showLocations && (
                  <ul className="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
                    {locations.map((loc) => (
                      <li
                        key={loc}
                        className="px-4 py-2 hover:bg-teal-50 cursor-pointer"
                        onClick={() => {
                          setLocation(loc);
                          setShowLocations(false);
                        }}
                      >
                        {loc}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* Department Dropdown */}
              <div className="relative flex-grow" ref={departmentRef}>
                <input
                  type="text"
                  placeholder="Select Department"
                  className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={department}
                  onFocus={() => setShowDepartments(true)}
                  readOnly
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-400"
                  onClick={() => setShowDepartments((v) => !v)}
                  tabIndex={-1}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showDepartments && (
                  <ul className="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
                    {departments.map((dept) => (
                      <li
                        key={dept}
                        className="px-4 py-2 hover:bg-teal-50 cursor-pointer"
                        onClick={() => {
                          setDepartment(dept);
                          setShowDepartments(false);
                        }}
                      >
                        {dept}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                type="submit"
                className="bg-teal-600 text-white px-4 py-2 rounded-md whitespace-nowrap hover:bg-teal-700 transition-colors font-medium"
              >
                Find Doctors
              </button>
            </form>
          </div>
          {/* Right content - Image and floating cards */}
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
              {/* Floating info cards */}
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