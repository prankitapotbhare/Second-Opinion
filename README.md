# Second Opinion - Medical Consultation Platform

![Second Opinion](https://img.shields.io/badge/Second%20Opinion-Medical%20Platform-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Media%20Management-blue)

**Second Opinion** is a comprehensive digital healthcare platform that connects patients with qualified doctors for medical consultations and second opinions. Built with modern web technologies, this full-stack application provides a seamless experience for patients seeking professional medical advice and doctors managing their practice.

## 🏥 Project Overview

This is a multi-role healthcare platform designed to facilitate remote medical consultations, appointment scheduling, and medical record management. The platform serves three primary user types: patients, doctors, and administrators.

## 🛠️ Technology Stack

### Frontend (Client)
- **Framework**: Next.js 15.2.4 with React 19
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **Media Management**: Cloudinary React SDK
- **UI Components**: React Icons, Custom components
- **HTTP Client**: Axios
- **Notifications**: React Toastify

### Backend (Server)
- **Runtime**: Node.js with Express.js 5.1.0
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **File Upload**: Multer with Cloudinary integration
- **Email Service**: Nodemailer
- **SMS Service**: Twilio
- **PDF Generation**: PDFKit
- **Excel Export**: ExcelJS

## 🎯 Key Features

### For Patients
- 🔍 **Doctor Discovery**: Browse and search qualified doctors by specialization
- 📋 **Profile Management**: Complete patient profiles with medical history
- 📅 **Appointment Booking**: Schedule consultations with available time slots
- 📄 **Medical Records**: Upload and manage medical documents
- ⭐ **Reviews & Ratings**: Rate and review doctor consultations
- 💬 **Secure Communication**: HIPAA-compliant messaging with doctors

### For Doctors
- 👨‍⚕️ **Professional Profiles**: Comprehensive profiles with credentials
- ⏰ **Availability Management**: Set working hours and appointment slots
- 👥 **Patient Management**: View patient details and medical history
- 📋 **Document Review**: Access patient-uploaded medical documents
- 💭 **Response System**: Provide medical opinions and consultations
- 📊 **Dashboard Analytics**: Track appointments and performance metrics

### For Administrators
- 👥 **User Management**: Oversee doctor and patient registrations
- 📊 **Platform Analytics**: Comprehensive dashboard with statistics
- 📄 **Document Management**: Monitor platform-wide document uploads
- 💰 **Invoice Generation**: Automated billing for doctors
- 📈 **Excel Reporting**: Export detailed reports

## 🏗️ Project Structure

```
Second-Opinion/
├── client/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React Context providers
│   │   ├── api/          # API client functions
│   │   └── utils/        # Utility functions
│   └── public/           # Static assets
├── server/                # Node.js backend application
│   └── src/
│       ├── controllers/   # Route controllers
│       ├── models/       # MongoDB models
│       ├── routes/       # API routes
│       ├── services/     # Business logic services
│       ├── middleware/   # Custom middleware
│       └── utils/        # Utility functions
└── docs/                 # Documentation files
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account for media management
- Email service credentials (for notifications)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Second-Opinion
   ```

2. **Install dependencies**
   ```bash
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` files in both client and server directories:
   
   **Client (.env.local)**
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
   
   **Server (.env)**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/second-opinion
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_refresh_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   EMAIL_HOST=your_email_host
   EMAIL_PORT=587
   EMAIL_USER=your_email
   EMAIL_PASS=your_password
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   ```

4. **Start the development servers**
   
   **Terminal 1 (Server)**
   ```bash
   cd server
   npm run dev
   ```
   
   **Terminal 2 (Client)**
   ```bash
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📚 Documentation

- [API Documentation](./server/README.md)
- [Frontend Documentation](./client/README.md)

## 🔧 Development Scripts

### Server Scripts
```bash
npm run dev              # Start development server
npm start               # Start production server
npm run create-admin    # Create admin user
npm run generate-doctors # Generate sample doctors
npm run generate-patients # Generate sample patients
```

### Client Scripts
```bash
npm run dev             # Start development server
npm run build          # Build for production
npm start              # Start production server
npm run lint           # Run ESLint
```

## 🛡️ Security Features

- JWT-based authentication with refresh tokens
- Role-based access control (Patient, Doctor, Admin)
- Email verification system
- Secure file upload with type validation
- Password hashing with bcryptjs
- CORS protection
- Input validation and sanitization

## 🌐 Deployment

### Frontend (Vercel/Netlify)
1. Build the client application
2. Deploy to your preferred platform
3. Configure environment variables

### Backend (Railway/Heroku/DigitalOcean)
1. Set up MongoDB database
2. Configure environment variables
3. Deploy the server application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@secondopinion.com or join our Slack channel.

## 🙏 Acknowledgments

- Thanks to all healthcare professionals who inspired this platform
- Built with modern web technologies for optimal performance
- Designed with patient privacy and security as top priorities