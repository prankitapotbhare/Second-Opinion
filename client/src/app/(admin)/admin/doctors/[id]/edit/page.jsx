"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '../../../../components';

const EditDoctor = () => {
  const { id } = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    status: '',
    patients: 0
  });

  useEffect(() => {
    // Fetch doctor data based on ID
    // This is a mock implementation
    import('@/data/mockData').then(({ doctors }) => {
      const foundDoctor = doctors.find(d => d.id.toString() === id);
      if (foundDoctor) {
        setDoctor(foundDoctor);
        setFormData({
          name: foundDoctor.name,
          specialization: foundDoctor.specialization,
          status: foundDoctor.status,
          patients: foundDoctor.patients
        });
      }
      setLoading(false);
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Updated doctor data:', formData);
    // Redirect back to doctor details page
    router.push(`/admin/doctors/${id}`);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-[#f0f8ff]">
        <Header title="Doctor Not Found" />
        <div className="max-w-[1440px] mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Doctor Not Found</h2>
          <p className="text-gray-600">The doctor you are trying to edit does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f8ff]">
      <Header title={`Edit Doctor: ${doctor.name}`} />
      
      <main className="max-w-[1440px] mx-auto px-6 pb-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patients
                </label>
                <input
                  type="number"
                  name="patients"
                  value={formData.patients}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditDoctor;