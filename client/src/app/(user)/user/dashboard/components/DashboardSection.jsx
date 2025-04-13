import React from "react";
import { FaCalendarAlt, FaUserMd, FaClipboardList } from "react-icons/fa";
import Link from "next/link";

const DashboardSection = () => {
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
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Dashboard</h1>
      
      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Link href="/user/appointment/booking">
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center cursor-pointer hover:shadow-md transition-shadow">
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
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center cursor-pointer hover:shadow-md transition-shadow">
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
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center cursor-pointer hover:shadow-md transition-shadow">
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
      
      {/* Upcoming Appointments */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800">Upcoming Appointments</h2>
          <Link href="/user/appointment/booking">
            <button className="text-sm px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors">
              Book New
            </button>
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
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
                <tr key={appointment.id}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{appointment.doctor}</div>
                    <div className="text-sm text-gray-500">{appointment.specialty}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{appointment.date}</div>
                    <div className="text-sm text-gray-500">{appointment.time}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/user/appointments/${appointment.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                      View
                    </Link>
                    <button className="text-red-600 hover:text-red-900">
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
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Book an Appointment
              </button>
            </Link>
          </div>
        )}
      </div>
      
      {/* Health Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Health Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-2">Recent Diagnoses</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Seasonal Allergies - Mar 10, 2023</li>
              <li>Vitamin D Deficiency - Feb 15, 2023</li>
            </ul>
          </div>
          <div>
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