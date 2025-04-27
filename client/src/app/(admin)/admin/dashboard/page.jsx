import React from 'react';
import { 
  FaUserMd, 
  FaChartLine, 
  FaUser, 
  FaCalendarCheck, 
  FaCheck, 
  FaClock, 
  FaHourglassHalf, 
  FaCalendarAlt, 
  FaPlusCircle, 
  FaCheckCircle 
} from 'react-icons/fa';

const AdminDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-8 flex justify-center">
                    <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                </header>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {/* Card 1 */}
                    <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg cursor-pointer">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-blue-600 mb-2">
                                    <FaUserMd className="text-3xl" />
                                </div>
                                <h3 className="text-gray-600 font-medium mb-1">Total Doctors</h3>
                                <p className="text-3xl font-bold text-gray-800">124</p>
                            </div>
                            <div className="bg-blue-100 rounded-full p-2">
                                <FaChartLine className="text-blue-600" />
                            </div>
                        </div>
                    </div>
                    {/* Card 2 */}
                    <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg cursor-pointer">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-green-600 mb-2">
                                    <FaUser className="text-3xl" />
                                </div>
                                <h3 className="text-gray-600 font-medium mb-1">Total Patients</h3>
                                <p className="text-3xl font-bold text-gray-800">248</p>
                            </div>
                            <div className="bg-green-100 rounded-full p-2">
                                <FaChartLine className="text-green-600" />
                            </div>
                        </div>
                    </div>
                    {/* Card 3 */}
                    <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg cursor-pointer">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-purple-600 mb-2">
                                    <FaCalendarCheck className="text-3xl" />
                                </div>
                                <h3 className="text-gray-600 font-medium mb-1">Completed Appointments</h3>
                                <p className="text-3xl font-bold text-gray-800">85</p>
                            </div>
                            <div className="bg-purple-100 rounded-full p-2">
                                <FaCheck className="text-purple-600" />
                            </div>
                        </div>
                    </div>
                    {/* Card 4 */}
                    <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg cursor-pointer">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-amber-600 mb-2">
                                    <FaClock className="text-3xl" />
                                </div>
                                <h3 className="text-gray-600 font-medium mb-1">Pending Appointments</h3>
                                <p className="text-3xl font-bold text-gray-800">42</p>
                            </div>
                            <div className="bg-amber-100 rounded-full p-2">
                                <FaHourglassHalf className="text-amber-600" />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Doctor Dashboard */}
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Doctor Dashboard</h2>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center">
                                                <FaUserMd className="mr-2" />
                                                Doctor Name
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center">
                                                <FaCalendarAlt className="mr-2" />
                                                Total Appointments
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center">
                                                <FaPlusCircle className="mr-2" />
                                                Response
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center">
                                                <FaCheckCircle className="mr-2" />
                                                Further Consultation
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr className="hover:bg-gray-50 cursor-pointer">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                    <FaUserMd />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">Dr. Ram Sharma</div>
                                                    <div className="text-sm text-gray-500">Cardiology</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">38</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">26</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 cursor-pointer">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                    <FaUserMd />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">Dr. Suraj Johnson</div>
                                                    <div className="text-sm text-gray-500">Cardiology</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">38</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">26</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 cursor-pointer">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                    <FaUserMd />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">Dr. Suresh Johnson</div>
                                                    <div className="text-sm text-gray-500">Cardiology</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">38</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">26</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 cursor-pointer">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                    <FaUserMd />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">Dr. Rahul Johnson</div>
                                                    <div className="text-sm text-gray-500">Cardiology</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">38</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">26</td>
                                    </tr>
                                    {/* Other table rows remain same with FaUserMd icon */}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors whitespace-nowrap cursor-pointer">
                            View All Doctors
                        </button>
                    </div>
                </div>
                {/* User Dashboard */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">User Dashboard</h2>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center">
                                                <FaUserMd className="mr-2" />
                                                User Name
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center">
                                                <FaCalendarAlt className="mr-2" />
                                                Total Appointments
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center">
                                                <FaPlusCircle className="mr-2" />
                                                Response
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center">
                                                <FaCheckCircle className="mr-2" />
                                                 Further Consultation
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr className="hover:bg-gray-50 cursor-pointer">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                    <FaUser />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">Tom Smith</div>
                                                    <div className="text-sm text-gray-500">john.smith@example.com</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Other table cells */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">38</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">26</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 cursor-pointer">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                    <FaUser />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">kady Smile</div>
                                                    <div className="text-sm text-gray-500">john.smith@example.com</div>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Other table cells */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">38</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">26</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 cursor-pointer">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                    <FaUser />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">Joh Smith</div>
                                                    <div className="text-sm text-gray-500">john.smith@example.com</div>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Other table cells */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">38</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">26</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50 cursor-pointer">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                    <FaUser />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">Jon Smith</div>
                                                    <div className="text-sm text-gray-500">john.smith@example.com</div>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Other table cells */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">38</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">26</td>
                                    </tr>
                                    {/* Other table rows remain same with FaUser icon */}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors whitespace-nowrap cursor-pointer">
                            View All Users
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AdminDashboard;