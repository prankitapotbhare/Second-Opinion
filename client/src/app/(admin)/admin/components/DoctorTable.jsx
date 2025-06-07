"use client";

import React from 'react';
import { FaEye, FaFileInvoice, FaPaperPlane } from 'react-icons/fa';
import { LoadingSpinner } from '@/components';

const DoctorTable = ({ doctors, onViewDocument, onViewInvoice, onSendInvoice, loadingViewDocument, loadingViewInvoice, loadingSendInvoice }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doctor
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Specialty
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Appointments
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Accepted Appointments
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {doctors.map((doctor) => (
              <tr key={doctor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{doctor.specialty}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.totalAppointments}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${doctor.acceptedAppointments > 30 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {doctor.acceptedAppointments}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button 
                    onClick={() => onViewDocument(doctor.id)}
                    className={`text-blue-500 hover:text-blue-700 flex items-center ${loadingViewDocument === doctor.id ? 'opacity-60 cursor-not-allowed' : ''}`}
                    disabled={loadingViewDocument === doctor.id}
                  >
                    {loadingViewDocument === doctor.id ? (
                      <LoadingSpinner fullScreen={false} size="small" color="blue" />
                    ) : (
                      <><FaEye className="mr-1" /> View</>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => onViewInvoice(doctor.id)}
                      className={`text-green-500 hover:text-green-700 flex items-center ${loadingViewInvoice === doctor.id ? 'opacity-60 cursor-not-allowed' : ''}`}
                      disabled={loadingViewInvoice === doctor.id}
                    >
                      {loadingViewInvoice === doctor.id ? (
                        <LoadingSpinner fullScreen={false} size="small" color="green" />
                      ) : (
                        <><FaFileInvoice className="mr-1" /> Save Invoice</>
                      )}
                    </button>
                    <button 
                      onClick={() => onSendInvoice(doctor.id)}
                      className={`text-blue-500 hover:text-blue-700 flex items-center ${loadingSendInvoice === doctor.id ? 'opacity-60 cursor-not-allowed' : ''}`}
                      disabled={loadingSendInvoice === doctor.id}
                    >
                      {loadingSendInvoice === doctor.id ? (
                        <LoadingSpinner fullScreen={false} size="small" color="blue" />
                      ) : (
                        <><FaPaperPlane className="mr-1" /> Send Invoice</>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorTable;