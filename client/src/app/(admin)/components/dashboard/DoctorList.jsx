import React from 'react';
import { FaPlus } from 'react-icons/fa';
import Link from 'next/link';

const DoctorList = ({ doctors }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Doctor List</h2>
        <Link href="/admin/doctors/add">
          <button className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2 cursor-pointer">
            <FaPlus /> Add New Doctor
          </button>
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doctor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Specialization
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patients
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {doctors.map((doctor, index) => (
              <tr key={doctor.id || index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                      <img 
                        src={doctor.avatar || doctor.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}`} 
                        alt={doctor.name}
                        className="h-10 w-10 object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                      {doctor.email && <div className="text-sm text-gray-500">{doctor.email}</div>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{doctor.specialization}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    doctor.status === 'Active' ? 'bg-green-100 text-green-800' : 
                    doctor.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {doctor.status || 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doctor.patients || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link href={`/admin/doctors/${doctor.id}`} className="text-blue-600 hover:text-blue-900 mr-3">View</Link>
                  <Link href={`/admin/doctors/${doctor.id}/edit`} className="text-green-600 hover:text-green-900 mr-3">Edit</Link>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorList;