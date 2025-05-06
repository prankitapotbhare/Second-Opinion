// Mock data for the application

// Mock users
export const users = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'user@example.com',
    role: "patient",
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=250&q=80'
  },
  {
    id: 'doctor-1',
    name: 'Dr. Jane Smith',
    email: 'doctor@example.com',
    role: 'doctor',
    specialization: 'Cardiology',
    profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=250&q=80'
  },
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=250&q=80'
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