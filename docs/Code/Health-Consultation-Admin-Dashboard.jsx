// "use client";
// // The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
// import React, { useState } from 'react';
// import * as echarts from 'echarts';

// const App = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
  
//   return (
//     <div className="min-h-screen bg-[#f0f8ff]">
//       <div className="flex items-center justify-between max-w-[1440px] mx-auto p-6">
//         <div className="flex-1"></div>
//         <h1 className="text-2xl font-bold flex-1 text-center">Admin Panel</h1>
//         <div className="flex items-center gap-3 flex-1 justify-end">
//           <div className="w-10 h-10 rounded-full overflow-hidden">
//             <img
//               src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20male%20indian%20doctor%20wearing%20a%20white%20coat%20against%20a%20neutral%20background%2C%20high%20quality%20professional%20corporate%20photo&width=100&height=100&seq=1&orientation=squarish"
//               alt="Profile"
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <span className="font-medium">Uma Shankar (Admin)</span>
//         </div>
//       </div>
//       {/* Main Content */}
//       <main className="max-w-[1440px] mx-auto px-6 pb-8">
//         {/* Dashboard Cards */}
//         <div className="grid grid-cols-2 gap-6 mb-8">
//           {[
//             { title: 'Total Doctors', count: 128, icon: 'user-md', color: 'blue' },
//             { title: 'Total Patients', count: 128, icon: 'users', color: 'green' },
//             { title: 'Total Appointments', count: 345, icon: 'calendar-check', color: 'orange' },
//             { title: 'Appointments Pending', count: 35, icon: 'clock', color: 'red' }
//           ].map((card, index) => (
//             <div key={index} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <h3 className="text-gray-500 font-medium mb-2">{card.title}</h3>
//                   <p className="text-3xl font-semibold">{card.count}</p>
//                 </div>
//                 <div className={`w-12 h-12 rounded-lg flex items-center justify-center
//                   ${card.color === 'blue' ? 'bg-blue-100 text-blue-600' : ''}
//                   ${card.color === 'green' ? 'bg-green-100 text-green-600' : ''}
//                   ${card.color === 'orange' ? 'bg-orange-100 text-orange-600' : ''}
//                   ${card.color === 'red' ? 'bg-red-100 text-red-600' : ''}`}
//                 >
//                   <i className={`fas fa-${card.icon} text-xl`}></i>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//         {/* Doctor List */}
//         <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6 mb-8">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold">Doctor List</h2>
//             <button className="text-green-600 hover:text-green-700 font-medium cursor-pointer !rounded-button whitespace-nowrap">
//               See All
//             </button>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-gray-50">
//                   <th className="text-left p-4 font-semibold">Name</th>
//                   <th className="text-left p-4 font-semibold">Experience</th>
//                   <th className="text-left p-4 font-semibold">Specialization</th>
//                   <th className="text-left p-4 font-semibold">Contact</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {[
//                   { name: 'Dr. Pooja Sharma', exp: '12 yrs', spec: 'Neurologist', contact: '+91 9876543210' },
//                   { name: 'Dr. Arvind Kumar', exp: '15 yrs', spec: 'Cardiologist', contact: '+91 9988776655' },
//                   { name: 'Dr. Sneha Verma', exp: '09 yrs', spec: 'Dermatologist', contact: '+91 9876541230' },
//                   { name: 'Dr. Rajiv Bansal', exp: '11 yrs', spec: 'Orthopedic', contact: '+91 9123456789' },
//                   { name: 'Dr. Latha Iyer', exp: '08 yrs', spec: 'Pediatrician', contact: '+91 9988001122' }
//                 ].map((doctor, index) => (
//                   <tr key={index} className="border-b hover:bg-gray-50">
//                     <td className="p-4">{doctor.name}</td>
//                     <td className="p-4">{doctor.exp}</td>
//                     <td className="p-4">{doctor.spec}</td>
//                     <td className="p-4">{doctor.contact}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//         {/* User List */}
//         <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold">User List</h2>
//             <button className="text-green-600 hover:text-green-700 font-medium cursor-pointer !rounded-button whitespace-nowrap">
//               See All
//             </button>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-gray-50">
//                   <th className="text-left p-4 font-semibold">Name</th>
//                   <th className="text-left p-4 font-semibold">Gender</th>
//                   <th className="text-left p-4 font-semibold">Contact</th>
//                   <th className="text-left p-4 font-semibold">City</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {[
//                   { name: 'Karan Mehta', gender: 'Male', contact: '+91 7894561230', city: 'Ahmedabad' },
//                   { name: 'Priya Nair', gender: 'Female', contact: '+91 9123458765', city: 'Chennai' },
//                   { name: 'Rahul Jain', gender: 'Male', contact: '+91 9987453214', city: 'Bhopal' },
//                   { name: 'Ankita Joshi', gender: 'Female', contact: '+91 7894561230', city: 'Nagpur' }
//                 ].map((user, index) => (
//                   <tr key={index} className="border-b hover:bg-gray-50">
//                     <td className="p-4">{user.name}</td>
//                     <td className="p-4">{user.gender}</td>
//                     <td className="p-4">{user.contact}</td>
//                     <td className="p-4">{user.city}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default App;
