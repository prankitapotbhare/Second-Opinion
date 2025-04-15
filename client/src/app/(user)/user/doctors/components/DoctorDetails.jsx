import React, { useState } from 'react';
import { FaGraduationCap, FaCertificate, FaHospital, FaLanguage } from 'react-icons/fa';

const DoctorDetails = ({ doctor }) => {
  const [activeTab, setActiveTab] = useState('about');
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'about'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'education'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Education & Experience
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-6 py-4 text-sm font-medium ${
              activeTab === 'services'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Services
          </button>
        </nav>
      </div>
      
      <div className="p-6">
        {activeTab === 'about' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">About Dr. {doctor.name.split(' ')[1]}</h2>
            <p className="text-gray-700 mb-4">
              {doctor.about || `Dr. ${doctor.name} is a highly skilled ${doctor.specialization} with ${doctor.experience} years of experience. 
              They are dedicated to providing exceptional patient care and staying at the forefront of medical advancements in their field.`}
            </p>
            
            <div className="mt-6">
              <h3 className="text-md font-semibold text-gray-800 mb-3">Languages</h3>
              <div className="flex items-center">
                <FaLanguage className="text-blue-600 mr-2" />
                <span className="text-gray-700">
                  {doctor.languages?.join(', ') || 'English, Hindi'}
                </span>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'education' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Education & Experience</h2>
            
            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-800 mb-3">Education</h3>
              {doctor.education ? (
                <ul className="space-y-4">
                  {doctor.education.map((edu, index) => (
                    <li key={index} className="flex">
                      <FaGraduationCap className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">{edu.degree}</p>
                        <p className="text-gray-600">{edu.institution}</p>
                        <p className="text-sm text-gray-500">{edu.year}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-4">
                  <li className="flex">
                    <FaGraduationCap className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">MBBS</p>
                      <p className="text-gray-600">All India Institute of Medical Sciences</p>
                      <p className="text-sm text-gray-500">2010</p>
                    </div>
                  </li>
                  <li className="flex">
                    <FaGraduationCap className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">MD, {doctor.specialization}</p>
                      <p className="text-gray-600">Postgraduate Institute of Medical Education and Research</p>
                      <p className="text-sm text-gray-500">2014</p>
                    </div>
                  </li>
                </ul>
              )}
            </div>
            
            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-800 mb-3">Certifications</h3>
              {doctor.certifications ? (
                <ul className="space-y-4">
                  {doctor.certifications.map((cert, index) => (
                    <li key={index} className="flex">
                      <FaCertificate className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">{cert.name}</p>
                        <p className="text-sm text-gray-500">{cert.year}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-4">
                  <li className="flex">
                    <FaCertificate className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">Board Certified in {doctor.specialization}</p>
                      <p className="text-sm text-gray-500">2015</p>
                    </div>
                  </li>
                </ul>
              )}
            </div>
            
            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-3">Work Experience</h3>
              {doctor.workExperience ? (
                <ul className="space-y-4">
                  {doctor.workExperience.map((exp, index) => (
                    <li key={index} className="flex">
                      <FaHospital className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">{exp.position}</p>
                        <p className="text-gray-600">{exp.hospital}</p>
                        <p className="text-sm text-gray-500">{exp.duration}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-4">
                  <li className="flex">
                    <FaHospital className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">Senior {doctor.specialization}</p>
                      <p className="text-gray-600">Apollo Hospitals</p>
                      <p className="text-sm text-gray-500">2015 - 2020</p>
                    </div>
                  </li>
                  <li className="flex">
                    <FaHospital className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">Consultant {doctor.specialization}</p>
                      <p className="text-gray-600">Max Healthcare</p>
                      <p className="text-sm text-gray-500">2020 - Present</p>
                    </div>
                  </li>
                </ul>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'services' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Services Offered</h2>
            {doctor.services ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctor.services.map((service, index) => (
                  <li key={index} className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{service}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 mt-0.5">
                    1
                  </div>
                  <span className="text-gray-700">Consultation</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 mt-0.5">
                    2
                  </div>
                  <span className="text-gray-700">Diagnosis</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 mt-0.5">
                    3
                  </div>
                  <span className="text-gray-700">Treatment Planning</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 mt-0.5">
                    4
                  </div>
                  <span className="text-gray-700">Follow-up Care</span>
                </li>
              </ul>
            )}
            
            <div className="mt-8">
              <h3 className="text-md font-semibold text-gray-800 mb-3">Consultation Fees</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">In-person Consultation</span>
                  <span className="font-medium text-gray-900">₹{doctor.fees?.inPerson || 1500}</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Video Consultation</span>
                  <span className="font-medium text-gray-900">₹{doctor.fees?.video || 1200}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDetails;