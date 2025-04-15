import React from "react";
import { FaCalendarAlt, FaUserMd, FaClipboardList, FaChartLine, FaFileMedical } from "react-icons/fa";
import Link from "next/link";

const DashboardSection = ({ statCards }) => {
  // Mock data for upcoming appointments
  const upcomingAppointments = [
    {
      id: "APT-12345",
      doctor: "Dr. Emily Johnson",
      specialty: "Cardiologist",
      date: "April 15, 2023",
      time: "10:30 AM",
      status: "Confirmed"
    },
    {
      id: "APT-12346",
      doctor: "Dr. Michael Chen",
      specialty: "Dermatologist",
      date: "April 22, 2023",
      time: "2:00 PM",
      status: "Pending"
    }
  ];

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#f0f8ff]">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {statCards && statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-full bg-${card.color}-100 flex items-center justify-center text-${card.color}-600 mr-4`}>
                {card.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <h3 className="text-xl font-bold text-gray-800">{card.count}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <Link href="/user/appointment/booking">
          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center cursor-pointer border border-blue-200 hover:shadow-md hover:scale-[1.02] transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
              <FaCalendarAlt size={20} />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Book Appointment</h3>
              <p className="text-sm text-gray-500">Schedule a new consultation</p>
            </div>
          </div>
        </Link>
        
        <Link href="/user/doctors">
          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center cursor-pointer border border-green-200 hover:shadow-md hover:scale-[1.02] transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-4">
              <FaUserMd size={20} />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Find Doctors</h3>
              <p className="text-sm text-gray-500">Browse specialists</p>
            </div>
          </div>
        </Link>
        
        <Link href="/user/medical-records">
          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center cursor-pointer border border-purple-200 hover:shadow-md hover:scale-[1.02] transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-4">
              <FaClipboardList size={20} />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Medical Records</h3>
              <p className="text-sm text-gray-500">View your health documents</p>
            </div>
          </div>
        </Link>
      </div>
      
      {/* Rest of the component remains the same */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-4 md:p-6 border border-blue-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800 flex items-center">
            <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
              <FaCalendarAlt size={14} />
            </span>
            Upcoming Appointments
          </h2>
          <Link href="/user/appointment/booking">
            <button className="text-sm px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-all duration-300">
              Book New
            </button>
          </Link>
        </div>
        
        {/* Table content remains the same */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 rounded-t-lg">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {upcomingAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-blue-50 transition-colors duration-200">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{appointment.doctor}</div>
                    <div className="text-sm text-gray-500">{appointment.specialty}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{appointment.date}</div>
                    <div className="text-sm text-gray-500">{appointment.time}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/user/appointments/${appointment.id}`} className="text-blue-600 hover:text-blue-900 mr-3 hover:underline">
                      View
                    </Link>
                    <button className="text-red-600 hover:text-red-900 hover:underline">
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {upcomingAppointments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You don't have any upcoming appointments.</p>
            <Link href="/user/doctors">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300">
                Book an Appointment
              </button>
            </Link>
          </div>
        )}
        
        <Link href="/user/appointment/history">
          <button className="mt-6 w-full py-2 bg-blue-100 text-blue-700 rounded-md font-medium text-sm hover:bg-blue-200 transition-all duration-300">
            View All Appointments
          </button>
        </Link>
        </div>
        
        {/* Health Stats Quick View */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-green-100">
          <h3 className="text-base sm:text-lg font-medium text-gray-800 flex items-center mb-4">
            <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2">
              <FaChartLine size={14} />
            </span>
            Health Overview
          </h3>
          
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-green-200 transition-all duration-300">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-800">Last Checkup</p>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">2 weeks ago</span>
              </div>
              <p className="text-xs text-gray-500">General Health Assessment</p>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-green-200 transition-all duration-300">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-800">Upcoming Test</p>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">In 3 days</span>
              </div>
              <p className="text-xs text-gray-500">Blood Work • Dr. Johnson</p>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-green-200 transition-all duration-300">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-800">Prescription</p>
                <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">Refill needed</span>
              </div>
              <p className="text-xs text-gray-500">Medication X • 2 pills daily</p>
            </div>
          </div>
          
          <Link href="/user/medical-records">
            <button className="mt-6 w-full py-2 bg-green-100 text-green-700 rounded-md font-medium text-sm hover:bg-green-200 transition-all duration-300">
              View Medical Records
            </button>
          </Link>
        </div>
      </div>
      
      {/* Health Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-2">
            <FaFileMedical size={14} />
          </span>
          Health Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-purple-200 transition-all duration-300">
            <h3 className="text-md font-medium text-gray-700 mb-2">Recent Diagnoses</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Seasonal Allergies - Mar 10, 2023</li>
              <li>Vitamin D Deficiency - Feb 15, 2023</li>
            </ul>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-purple-200 transition-all duration-300">
            <h3 className="text-md font-medium text-gray-700 mb-2">Current Medications</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Cetirizine 10mg - Once daily</li>
              <li>Vitamin D3 1000 IU - Once daily</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardSection;