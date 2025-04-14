// Mock data for the application

// Mock users
export const users = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'user@example.com',
    role: 'user',
    profileImage: '/images/avatars/user-avatar.jpg'
  },
  {
    id: 'doctor-1',
    name: 'Dr. Jane Smith',
    email: 'doctor@example.com',
    role: 'doctor',
    specialization: 'Cardiology',
    profileImage: '/images/avatars/doctor-avatar.jpg'
  },
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    profileImage: '/images/avatars/admin-avatar.jpg'
  }
];

// Mock doctors for admin dashboard
export const doctors = [
  {
    id: 'doctor-1',
    name: 'Dr. Jane Smith',
    specialization: 'Cardiology',
    patients: 45,
    rating: 4.8,
    status: 'active',
    profileImage: '/images/avatars/doctor-1.jpg'
  },
  {
    id: 'doctor-2',
    name: 'Dr. Robert Johnson',
    specialization: 'Neurology',
    patients: 32,
    rating: 4.6,
    status: 'active',
    profileImage: '/images/avatars/doctor-2.jpg'
  },
  {
    id: 'doctor-3',
    name: 'Dr. Emily Chen',
    specialization: 'Pediatrics',
    patients: 38,
    rating: 4.9,
    status: 'active',
    profileImage: '/images/avatars/doctor-3.jpg'
  },
  {
    id: 'doctor-4',
    name: 'Dr. Michael Brown',
    specialization: 'Orthopedics',
    patients: 27,
    rating: 4.5,
    status: 'inactive',
    profileImage: '/images/avatars/doctor-4.jpg'
  }
];

export const activities = [
  { action: 'New doctor registered', time: '2 hours ago', icon: 'user-md', color: 'blue' },
  { action: 'Patient appointment confirmed', time: '3 hours ago', icon: 'calendar-check', color: 'green' },
  { action: 'New patient registered', time: '5 hours ago', icon: 'user-plus', color: 'purple' },
  { action: 'Doctor updated profile', time: '1 day ago', icon: 'user-edit', color: 'orange' },
  { action: 'Patient cancelled appointment', time: '1 day ago', icon: 'calendar-times', color: 'red' }
];

export const statCards = [
  { title: 'Total Doctors', count: 128, color: 'blue' },
  { title: 'Total Patients', count: 456, color: 'green' },
  { title: 'Total Appointments', count: 345, color: 'orange' },
  { title: 'Appointments Pending', count: 35, color: 'red' }
];
// Mock appointments for user dashboard
export const appointments = [
  {
    id: 'apt-1',
    doctor: 'Dr. Jane Smith',
    specialization: 'Cardiology',
    date: '2023-04-15',
    time: '10:30 AM',
    status: 'upcoming',
    type: 'video'
  },
  {
    id: 'apt-2',
    doctor: 'Dr. Robert Johnson',
    specialization: 'Neurology',
    date: '2023-04-20',
    time: '2:00 PM',
    status: 'upcoming',
    type: 'in-person'
  },
  {
    id: 'apt-3',
    doctor: 'Dr. Emily Chen',
    specialization: 'Pediatrics',
    date: '2023-03-28',
    time: '11:15 AM',
    status: 'completed',
    type: 'video'
  },
  {
    id: 'apt-4',
    doctor: 'Dr. Michael Brown',
    specialization: 'Orthopedics',
    date: '2023-03-15',
    time: '3:30 PM',
    status: 'cancelled',
    type: 'in-person'
  }
];

// Mock notifications
export const notifications = [
  {
    id: 'notif-1',
    title: 'Appointment Reminder',
    message: 'You have an appointment with Dr. Jane Smith tomorrow at 10:30 AM',
    time: '1 hour ago',
    read: false,
    type: 'appointment'
  },
  {
    id: 'notif-2',
    title: 'New Message',
    message: 'Dr. Robert Johnson sent you a message regarding your recent visit',
    time: '3 hours ago',
    read: false,
    type: 'message'
  },
  {
    id: 'notif-3',
    title: 'Medical Record Updated',
    message: 'Your medical record has been updated with recent test results',
    time: '1 day ago',
    read: true,
    type: 'medical'
  },
  {
    id: 'notif-4',
    title: 'Appointment Confirmed',
    message: 'Your appointment with Dr. Emily Chen has been confirmed',
    time: '2 days ago',
    read: true,
    type: 'appointment'
  }
];