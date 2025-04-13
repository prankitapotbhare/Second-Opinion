"use client";

import React, { useState } from 'react';
import { UserSidebar } from "@/components/layout/UserSidebar";
import UserHeader from "@/components/layout/UserHeader";
import { FaFileMedical, FaFileUpload, FaTrash, FaDownload, FaEye, FaSearch } from 'react-icons/fa';

export default function MedicalRecordsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [recordType, setRecordType] = useState('');
  const [recordDate, setRecordDate] = useState('');
  const [description, setDescription] = useState('');
  
  // Mock medical records data
  const [records, setRecords] = useState([
    {
      id: 1,
      name: 'Blood Test Report',
      type: 'Lab Report',
      date: '2023-03-15',
      doctor: 'Dr. Emily Johnson',
      hospital: 'Apollo Hospitals',
      description: 'Complete blood count and lipid profile',
      fileUrl: '#'
    },
    {
      id: 2,
      name: 'Chest X-Ray',
      type: 'Radiology',
      date: '2023-02-10',
      doctor: 'Dr. Michael Chen',
      hospital: 'Max Healthcare',
      description: 'Routine chest X-ray',
      fileUrl: '#'
    },
    {
      id: 3,
      name: 'Prescription',
      type: 'Prescription',
      date: '2023-04-05',
      doctor: 'Dr. Sarah Williams',
      hospital: 'Fortis Hospital',
      description: 'Medication for hypertension',
      fileUrl: '#'
    }
  ]);
  
  const handleTabClick = (tab) => {
    setIsSidebarOpen(false);
  };
  
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || record.type.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleUpload = (e) => {
    e.preventDefault();
    
    if (!selectedFile || !recordType || !recordDate) {
      alert('Please fill all required fields');
      return;
    }
    
    // In a real app, you would upload the file to your server here
    // For now, we'll just add it to our records array
    const newRecord = {
      id: records.length + 1,
      name: selectedFile.name,
      type: recordType,
      date: recordDate,
      doctor: 'Self Upload',
      hospital: 'N/A',
      description: description || 'No description provided',
      fileUrl: '#'
    };
    
    setRecords([...records, newRecord]);
    setUploadModalOpen(false);
    resetUploadForm();
  };
  
  const resetUploadForm = () => {
    setSelectedFile(null);
    setRecordType('');
    setRecordDate('');
    setDescription('');
  };
  
  const deleteRecord = (id) => {
    if (confirm('Are you sure you want to delete this record?')) {
      setRecords(records.filter(record => record.id !== id));
    }
  };
  
  return (
    <div className="flex h-screen bg-[#E8F9FF] relative overflow-hidden">
      <UserSidebar 
        activeTab="medical-records" 
        handleTabClick={handleTabClick} 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <UserHeader />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">Medical Records</h1>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <FaFileUpload className="mr-2" />
              Upload Record
            </button>
          </div>
          
          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search records by name, doctor, or description"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <select
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="lab report">Lab Reports</option>
                  <option value="radiology">Radiology</option>
                  <option value="prescription">Prescriptions</option>
                  <option value="discharge summary">Discharge Summaries</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Records List */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {filteredRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Record Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor/Hospital
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRecords.map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaFileMedical className="text-blue-500 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{record.name}</div>
                              <div className="text-sm text-gray-500">{record.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {record.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{record.doctor}</div>
                          <div className="text-sm text-gray-500">{record.hospital}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <FaEye title="View" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <FaDownload title="Download" />
                            </button>
                            <button 
                              className="text-red-600 hover:text-red-900"
                              onClick={() => deleteRecord(record.id)}
                            >
                              <FaTrash title="Delete" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <FaFileMedical className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No records found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filter !== 'all' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'Get started by uploading a medical record'}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
      
      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Upload Medical Record</h3>
            </div>
            
            <form onSubmit={handleUpload} className="px-6 py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File *
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <FaFileUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only" 
                          onChange={handleFileChange}
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>
                {selectedFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected file: {selectedFile.name}
                  </p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Record Type *
                </label>
                <select
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={recordType}
                  onChange={(e) => setRecordType(e.target.value)}
                  required
                >
                  <option value="">Select a type</option>
                  <option value="Lab Report">Lab Report</option>
                  <option value="Radiology">Radiology</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Discharge Summary">Discharge Summary</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Record Date *
                </label>
                <input
                  type="date"
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={recordDate}
                  onChange={(e) => setRecordDate(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Add a brief description of this record"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={() => setUploadModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}