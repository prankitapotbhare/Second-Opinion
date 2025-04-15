import React, { useState } from "react";
import { FaSearch, FaFilter, FaCalendarAlt, FaEye, FaTimes } from "react-icons/fa";
import Link from "next/link";

const AppointmentsSection = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data for appointments
  const allAppointments = [
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
    },
    {
      id: "APT-12347",
      doctor: "Dr. Sarah Williams",
      specialty: "Neurologist",
      date: "March 10, 2023",
      time: "9:15 AM",
      status: "Completed"
    },
    {
      id: "APT-12348",
      doctor: "Dr. Robert Garcia",
      specialty: "Orthopedic Surgeon",
      date: "February 28, 2023",
      time: "3:45 PM",
      status: "Cancelled"
    }
  ];
  
  // Filter appointments based on status and search term
  const filteredAppointments = allAppointments.filter(appointment => {
    const matchesFilter = filter === "all" || appointment.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          appointment.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-0 flex items-center">
          <FaCalendarAlt className="mr-2 text-blue-600" />
          My Appointments
        </h1>
        <Link href="/user/appointment/booking">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 shadow-sm">
            Book New Appointment
          </button>
        </Link>
      </div>
      
      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by doctor or specialty"
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="md:w-64">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Appointments</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appointment ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-blue-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {appointment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{appointment.doctor}</div>
                      <div className="text-sm text-gray-500">{appointment.specialty}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.date}</div>
                      <div className="text-sm text-gray-500">{appointment.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        appointment.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/user/appointments/${appointment.id}`}>
                        <button className="text-blue-600 hover:text-blue-900 mr-3 inline-flex items-center">
                          <FaEye className="mr-1" /> View
                        </button>
                      </Link>
                      {(appointment.status === 'Confirmed' || appointment.status === 'Pending') && (
                        <button className="text-red-600 hover:text-red-900 inline-flex items-center">
                          <FaTimes className="mr-1" /> Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    No appointments found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {filteredAppointments.length === 0 && searchTerm === '' && filter === 'all' && (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">You don't have any appointments yet.</p>
            <Link href="/user/doctors">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300">
                Find a Doctor
              </button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default AppointmentsSection;