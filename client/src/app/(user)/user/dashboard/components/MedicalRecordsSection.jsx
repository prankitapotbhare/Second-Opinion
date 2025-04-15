import React, { useState } from "react";
import { FaFileMedical, FaUpload, FaDownload, FaEye, FaTrash, FaSearch, FaFilter } from "react-icons/fa";
import Link from "next/link";

const MedicalRecordsSection = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  
  // Mock data for medical records
  const allMedicalRecords = [
    {
      id: "MR-12345",
      title: "Annual Physical Examination",
      doctor: "Dr. Emily Johnson",
      date: "March 15, 2023",
      type: "Examination",
      fileSize: "2.4 MB",
      fileType: "PDF"
    },
    {
      id: "MR-12346",
      title: "Blood Test Results",
      doctor: "Dr. Michael Chen",
      date: "February 22, 2023",
      type: "Lab Results",
      fileSize: "1.8 MB",
      fileType: "PDF"
    },
    {
      id: "MR-12347",
      title: "X-Ray Report",
      doctor: "Dr. Sarah Williams",
      date: "January 10, 2023",
      type: "Imaging",
      fileSize: "5.2 MB",
      fileType: "DICOM"
    },
    {
      id: "MR-12348",
      title: "Prescription",
      doctor: "Dr. Robert Garcia",
      date: "April 5, 2023",
      type: "Medication",
      fileSize: "0.5 MB",
      fileType: "PDF"
    }
  ];
  
  // Filter records based on type and search term
  const filteredRecords = allMedicalRecords.filter(record => {
    const matchesFilter = filter === "all" || record.type.toLowerCase() === filter.toLowerCase();
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-0 flex items-center">
          <FaFileMedical className="mr-2 text-blue-600" />
          Medical Records
        </h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 shadow-sm flex items-center">
          <FaUpload className="mr-2" />
          Upload New Record
        </button>
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
              placeholder="Search by title or doctor"
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
                <option value="all">All Records</option>
                <option value="examination">Examinations</option>
                <option value="lab results">Lab Results</option>
                <option value="imaging">Imaging</option>
                <option value="medication">Medications</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Medical Records List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Record
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-blue-50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{record.title}</div>
                      <div className="text-xs text-gray-500">{record.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.doctor}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.type === 'Examination' ? 'bg-green-100 text-green-800' :
                        record.type === 'Lab Results' ? 'bg-blue-100 text-blue-800' :
                        record.type === 'Imaging' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {record.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.fileType}</div>
                      <div className="text-xs text-gray-500">{record.fileSize}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3 inline-flex items-center">
                        <FaEye className="mr-1" /> View
                      </button>
                      <button className="text-green-600 hover:text-green-900 mr-3 inline-flex items-center">
                        <FaDownload className="mr-1" /> Download
                      </button>
                      <button className="text-red-600 hover:text-red-900 inline-flex items-center">
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    No medical records found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {filteredRecords.length === 0 && searchTerm === '' && filter === 'all' && (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">You don't have any medical records yet.</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 flex items-center mx-auto">
              <FaUpload className="mr-2" />
              Upload Your First Record
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default MedicalRecordsSection;