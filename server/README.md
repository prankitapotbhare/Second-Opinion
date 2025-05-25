# Second Opinion - Backend API Server

![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-blue)

This is the backend API server for the Second Opinion medical consultation platform, built with Node.js, Express.js, and MongoDB.

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose ODM 8.14.0
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer with Cloudinary integration
- **Email Service**: Nodemailer
- **SMS Service**: Twilio
- **PDF Generation**: PDFKit
- **Excel Export**: ExcelJS
- **Task Scheduling**: Node-cron
- **Google OAuth**: Google Auth Library

## 📁 Project Structure

```
src/
├── controllers/           # Route controllers
│   ├── admin.controller.js    # Admin operations
│   ├── auth.controller.js     # Authentication
│   ├── doctor.controller.js   # Doctor operations
│   └── patient.controller.js  # Patient operations
├── models/               # MongoDB models
│   ├── admin.model.js        # Admin schema
│   ├── availability.model.js # Doctor availability
│   ├── doctor.model.js       # Doctor schema
│   ├── patient.model.js      # Patient schema
│   ├── patientDetails.model.js # Patient consultation details
│   └── token.model.js        # JWT token management
├── routes/               # API routes
│   ├── admin.routes.js       # Admin endpoints
│   ├── auth.routes.js        # Authentication endpoints
│   ├── doctor.routes.js      # Doctor endpoints
│   └── patient.routes.js     # Patient endpoints
├── services/             # Business logic services
│   ├── auth.service.js       # Authentication logic
│   ├── cloudinary.service.js # Media management
│   ├── email.service.js      # Email notifications
│   ├── excel.service.js      # Excel generation
│   ├── file.service.js       # File operations
│   ├── pdf.service.js        # PDF generation
│   ├── twilio.service.js     # SMS notifications
│   ├── user.service.js       # User operations
│   └── validation.service.js # Input validation
├── middleware/           # Custom middleware
│   ├── admin-restriction.middleware.js # Admin access control
│   ├── auth.middleware.js    # JWT verification
│   ├── error.middleware.js   # Error handling
│   ├── role.middleware.js    # Role-based access
│   └── upload.middleware.js  # File upload handling
├── utils/                # Utility functions
│   ├── constants.js          # Application constants
│   ├── email-templates.util.js # Email templates
│   ├── error.util.js         # Error utilities
│   ├── logger.util.js        # Logging utilities
│   ├── response.util.js      # Response formatting
│   ├── token.util.js         # JWT utilities
│   └── validation.util.js    # Validation helpers
├── jobs/                 # Background jobs
│   └── appointment-status-updater.js # Scheduled tasks
├── scripts/              # Utility scripts
│   ├── create-admin.js       # Create admin user
│   ├── generate-doctors.js   # Generate sample doctors
│   ├── generate-patients.js  # Generate sample patients
│   ├── generate-patient-details.js # Generate consultations
│   ├── generate-jwt-secrets.js # Generate JWT secrets
│   ├── migrateToCloudinary.js # Migrate to Cloudinary
│   ├── test-email.js         # Test email service
│   └── test-twilio.js        # Test SMS service
├── app.js                # Express app configuration
└── server.js             # Server entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud instance)
- Cloudinary account
- Email service credentials
- Twilio account (for SMS)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   
   Create `.env` file:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/second-opinion
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
   JWT_EXPIRE=24h
   JWT_REFRESH_EXPIRE=7d
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM=noreply@secondopinion.com
   
   # Twilio Configuration
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # Frontend URL
   CLIENT_URL=http://localhost:3000
   
   # Admin Configuration
   ADMIN_EMAIL=admin@secondopinion.com
   ADMIN_PASSWORD=Admin@123
   ```

3. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📜 Available Scripts

```bash
# Development
npm run dev                    # Start with nodemon
npm start                     # Start production server

# Database Setup
npm run create-admin          # Create admin user
npm run generate-doctors      # Generate sample doctors (500)
npm run generate-patients     # Generate sample patients (1000)
npm run generate-patient-details # Generate consultation data

# Utilities
npm run generate-jwt          # Generate JWT secrets
npm run migrateToCloudinary   # Migrate files to Cloudinary
npm run test-email           # Test email configuration
npm run test-twilio          # Test SMS configuration
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
```
POST   /register           # User registration
POST   /login              # User login
POST   /logout             # User logout
POST   /refresh-token      # Refresh JWT token
POST   /forgot-password    # Request password reset
POST   /reset-password     # Reset password
POST   /verify-email       # Verify email address
POST   /resend-verification # Resend verification email
GET    /me                 # Get current user
```

### Patient Routes (`/api/patient`)
```
GET    /doctors            # Get all doctors with filters
GET    /doctors/:id        # Get doctor by ID
POST   /submit-details     # Submit patient consultation
POST   /request-appointment # Request appointment
GET    /response/:id       # Get consultation response
GET    /reviews/:doctorId  # Get doctor reviews
POST   /reviews            # Submit doctor review
GET    /time-slots/:doctorId # Get available time slots
```

### Doctor Routes (`/api/doctor`)
```
GET    /profile            # Get doctor profile
PUT    /profile            # Update doctor profile
GET    /availability       # Get availability settings
PUT    /availability       # Update availability
GET    /patients           # Get assigned patients
GET    /patients/:id       # Get patient details
POST   /response           # Send consultation response
GET    /dashboard-stats    # Get dashboard statistics
POST   /upload-documents   # Upload profile documents
```

### Admin Routes (`/api/admin`)
```
GET    /stats              # Get platform statistics
GET    /doctors            # Get all doctors
GET    /patients           # Get all patients
GET    /doctors/:id/patients # Get doctor's patients (Excel)
GET    /doctors/:id/invoice  # Generate doctor invoice (PDF)
POST   /doctors/:id/send-invoice # Email invoice to doctor
PUT    /doctors/:id/verify   # Verify doctor profile
DELETE /users/:id          # Delete user account
```

## 🗄️ Database Models

### User Models
- **Patient**: Patient information and authentication
- **Doctor**: Doctor profiles, credentials, and specializations
- **Admin**: Administrator accounts

### Core Models
- **PatientDetails**: Consultation requests and medical information
- **Availability**: Doctor scheduling and time slot management
- **Token**: JWT token management and blacklisting

### Schema Features
- **Validation**: Comprehensive input validation
- **Indexing**: Optimized database queries
- **Relationships**: Proper model associations
- **Timestamps**: Automatic created/updated tracking

## 🔐 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure stateless authentication
- **Refresh Tokens**: Long-term session management
- **Role-based Access**: Patient, Doctor, Admin roles
- **Email Verification**: Account verification system
- **Password Security**: bcrypt hashing with salt

### Data Protection
- **Input Validation**: Comprehensive request validation
- **SQL Injection Prevention**: Mongoose ODM protection
- **XSS Protection**: Input sanitization
- **CORS Configuration**: Cross-origin request control
- **Rate Limiting**: API abuse prevention
- **File Upload Security**: Type and size validation

## 📧 Email System

### Email Templates
- Welcome emails for new users
- Email verification messages
- Password reset instructions
- Appointment confirmations
- Consultation notifications
- Invoice delivery

### Email Configuration
- **SMTP Support**: Gmail, Outlook, custom SMTP
- **HTML Templates**: Professional email designs
- **Attachment Support**: PDF invoices and documents
- **Error Handling**: Robust email delivery

## 📱 SMS Integration

### Twilio Features
- Appointment reminders
- Verification codes
- Emergency notifications
- Status updates

## 📄 File Management

### Cloudinary Integration
- **Image Upload**: Profile photos, medical images
- **PDF Upload**: Medical documents, reports
- **Optimization**: Automatic image optimization
- **Thumbnails**: PDF thumbnail generation
- **Security**: Secure file access controls

### File Types Supported
- Images: JPEG, PNG, GIF, WebP
- Documents: PDF, DOC, DOCX
- Size limits: 10MB per file

## 📊 Analytics & Reporting

### Dashboard Statistics
- Total users (patients, doctors)
- Appointment metrics
- Revenue tracking
- Platform usage analytics

### Export Features
- **Excel Reports**: Patient lists, appointment data
- **PDF Invoices**: Doctor billing statements
- **CSV Exports**: Data analysis exports

## 🔧 Background Jobs

### Scheduled Tasks
- **Appointment Status Updates**: Automatic status management
- **Email Notifications**: Scheduled reminders
- **Data Cleanup**: Remove expired tokens
- **Report Generation**: Automated reporting

## 🧪 Testing

### Test Scripts
```bash
# Test email configuration
npm run test-email

# Test SMS configuration  
npm run test-twilio

# Test database connection
node -e "require('./src/app.js')"
```

## 📦 Deployment

### Production Setup
1. **Environment Variables**: Configure all production variables
2. **Database**: Set up MongoDB Atlas or production database
3. **Cloudinary**: Configure production Cloudinary account
4. **Email Service**: Set up production email service
5. **SSL Certificate**: Enable HTTPS

### Deployment Platforms
- **Railway**: Recommended for full-stack deployment
- **Heroku**: Alternative cloud platform
- **DigitalOcean**: VPS deployment option
- **AWS**: Enterprise-level deployment

### Environment Variables for Production
```env
# Production Configuration
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/second-opinion

# JWT Configuration
JWT_SECRET=production_super_secret_jwt_key
JWT_REFRESH_SECRET=production_super_secret_refresh_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=production_cloud_name
CLOUDINARY_API_KEY=production_api_key
CLOUDINARY_API_SECRET=production_api_secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=production_email@domain.com
EMAIL_PASS=production_app_password

# Twilio Configuration
TWILIO_ACCOUNT_SID=production_twilio_sid
TWILIO_AUTH_TOKEN=production_twilio_token

# Frontend URL
CLIENT_URL=https://your-frontend-domain.com
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify MongoDB URI in environment variables
   - Check network connectivity to database
   - Ensure database user has proper permissions
   - Verify IP whitelist settings for cloud databases

2. **Authentication Problems**
   - Check JWT secret configuration
   - Verify token expiration settings
   - Ensure proper CORS configuration
   - Check refresh token implementation

3. **File Upload Issues**
   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure proper file type validation
   - Verify upload middleware configuration

4. **Email Service Problems**
   - Check SMTP credentials
   - Verify email service configuration
   - Test with email testing scripts
   - Check spam folder for test emails

5. **SMS Service Issues**
   - Verify Twilio credentials
   - Check phone number format
   - Ensure proper Twilio configuration
   - Test with SMS testing scripts

### Debug Commands
```bash
# Check server logs
npm run dev

# Test database connection
node -e "require('./src/app.js')"

# Test email service
npm run test-email

# Test SMS service
npm run test-twilio

# Generate JWT secrets
npm run generate-jwt
```

## 🔍 API Documentation

### Response Format
All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error information"
  }
}
```

### Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **422**: Validation Error
- **500**: Internal Server Error

## 🔧 Development Guidelines

### Code Style
- Use ES6+ features
- Follow consistent naming conventions
- Implement proper error handling
- Write meaningful commit messages
- Use async/await for asynchronous operations

### Database Guidelines
- Use proper indexing for queries
- Implement data validation at model level
- Use transactions for critical operations
- Follow MongoDB best practices
- Implement proper error handling

### Security Best Practices
- Validate all user inputs
- Use parameterized queries
- Implement rate limiting
- Use HTTPS in production
- Keep dependencies updated
- Follow OWASP guidelines

## 📈 Performance Optimization

### Database Optimization
- Implement proper indexing
- Use aggregation pipelines efficiently
- Optimize query performance
- Monitor database metrics
- Use connection pooling

### API Optimization
- Implement caching strategies
- Use compression middleware
- Optimize response payloads
- Implement pagination
- Use CDN for static assets

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Follow coding standards**
   - Write clean, readable code
   - Add proper documentation
   - Include error handling
   - Write meaningful tests

4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```

5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Provide clear description
   - Include testing instructions
   - Reference related issues

## 📚 Additional Resources

### Documentation Links
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [JWT Documentation](https://jwt.io/introduction/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Nodemailer Documentation](https://nodemailer.com/about/)
- [Twilio Documentation](https://www.twilio.com/docs)

### Learning Resources
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Performance Best Practices](https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 📞 Support

For technical support and questions:
- **Email**: support@secondopinion.com
- **Documentation**: [API Docs](./docs/api.md)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)

## 🙏 Acknowledgments

- Thanks to the Node.js community for excellent tools and libraries
- MongoDB team for the robust database solution
- Cloudinary for reliable media management
- All contributors who helped build this platform
- Healthcare professionals who provided valuable feedback