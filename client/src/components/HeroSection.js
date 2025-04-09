"use client";
import { useState } from "react";
import { departments } from "../data/staticData";

export default function HeroSection() {
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");
  const [showDepartments, setShowDepartments] = useState(false);

  return (
    <section className="bg-gradient-to-r from-green-50 to-white py-24 min-h-[500px] flex items-center">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 max-w-2xl mx-auto">
            Get Trusted Medical Second Opinions from Verified Experts
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with specialized doctors for reliable second opinions on your
            diagnosis and treatment plans.
          </p>
        </div>
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-map-marker-alt text-gray-400"></i>
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 border-none rounded-lg shadow-md focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
              placeholder="Enter your city or pin code"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="flex-1 relative">
            <div className="relative">
              <div
                className="w-full flex items-center justify-between pl-4 pr-3 py-3 bg-white rounded-lg shadow-md cursor-pointer"
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
                      className="px-4 py-2 hover:bg-green-50 cursor-pointer text-sm"
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
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg shadow-md !rounded-button whitespace-nowrap cursor-pointer">
            Find Doctors
          </button>
        </div>
      </div>
    </section>
  );
}