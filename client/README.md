# Second Opinion - Frontend Application

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)

This is the frontend application for the Second Opinion medical consultation platform, built with Next.js 15 and React 19.

## 🛠️ Technology Stack

- **Framework**: Next.js 15.2.4 with App Router
- **React**: 19.0.0 with modern hooks and features
- **Styling**: Tailwind CSS 4 for utility-first styling
- **State Management**: React Context API
- **HTTP Client**: Axios for API communication
- **Media Management**: Cloudinary React SDK
- **Icons**: React Icons library
- **Notifications**: React Toastify
- **Charts**: ECharts for data visualization
- **Date Handling**: date-fns for date manipulation

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (admin)/           # Admin dashboard pages
│   ├── (auth)/            # Authentication pages
│   ├── (doctor)/          # Doctor dashboard pages
│   ├── (patient)/         # Patient pages
│   ├── components/        # Page-specific components
│   ├── globals.css        # Global styles
│   ├── layout.jsx         # Root layout
│   └── page.jsx          # Home page
├── components/            # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── common/           # Common UI components
│   └── modals/           # Modal components
├── contexts/             # React Context providers
│   ├── AdminContext.jsx  # Admin state management
│   ├── AuthContext.jsx   # Authentication state
│   ├── DoctorContext.jsx # Doctor state management
│   └── PatientContext.jsx # Patient state management
├── api/                  # API client functions
│   ├── admin.api.js      # Admin API calls
│   ├── auth.api.js       # Authentication API
│   ├── doctor.api.js     # Doctor API calls
│   └── patient.api.js    # Patient API calls
├── utils/                # Utility functions
│   ├── authUtils.js      # Authentication utilities
│   ├── cloudinary.js     # Cloudinary helpers
│   └── toast.js          # Toast notification helpers
├── hooks/                # Custom React hooks
└── data/                 # Static data and mock data
```

## 🎨 Key Features

### User Interface
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Clean, professional medical platform design
- **Accessibility**: WCAG compliant components
- **Dark Mode Ready**: Prepared for theme switching

### Authentication & Authorization
- **Multi-role Support**: Patient, Doctor, and Admin roles
- **Protected Routes**: Role-based route protection
- **Email Verification**: Secure account verification
- **Password Reset**: Forgot password functionality
- **Google OAuth**: Social login integration

### Patient Features
- **Doctor Discovery**: Advanced search and filtering
- **Appointment Booking**: Interactive calendar and time slots
- **Medical Records**: Secure document upload and management
- **Review System**: Rate and review doctors
- **Profile Management**: Complete patient profiles

### Doctor Features
- **Professional Dashboard**: Comprehensive doctor interface
- **Patient Management**: View and manage patient consultations
- **Availability Settings**: Flexible scheduling system
- **Document Review**: Medical document viewer with PDF support
- **Response System**: Provide medical opinions and advice

### Admin Features
- **Analytics Dashboard**: Platform statistics and insights
- **User Management**: Oversee doctors and patients
- **Document Management**: Platform-wide file management
- **Invoice Generation**: Automated billing system
- **Excel Reports**: Comprehensive data exports

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   
   Create `.env.local` file:
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm start           # Start production server
npm run lint        # Run ESLint for code quality
```

## 🎯 Development Guidelines

### Component Structure
- Use functional components with hooks
- Implement proper prop validation
- Follow consistent naming conventions
- Create reusable components in `/components`

### State Management
- Use React Context for global state
- Implement proper error handling
- Follow immutable state patterns
- Use custom hooks for complex logic

### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and colors
- Use CSS modules for component-specific styles

### API Integration
- Centralize API calls in `/api` directory
- Implement proper error handling
- Use loading states for better UX
- Handle authentication tokens properly

## 🔧 Configuration

### Next.js Configuration
- **App Router**: Using the new Next.js 13+ App Router
- **Image Optimization**: Configured for Cloudinary and UI Avatars
- **Turbopack**: Enabled for faster development builds
- **ESLint**: Configured with Next.js recommended rules

### Tailwind CSS
- **Utility-first**: Comprehensive utility classes
- **Responsive**: Mobile-first breakpoints
- **Custom Colors**: Medical platform color scheme
- **Components**: Custom component classes

## 📱 Responsive Design

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+
- **Large Desktop**: 1440px+

## 🔒 Security Considerations

- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Secure form submissions
- **Content Security Policy**: Configured for external resources
- **Secure Headers**: Implemented security headers

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📦 Build & Deployment

### Production Build
```bash
npm run build
npm start
```

### Deployment Platforms
- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative deployment platform
- **Railway**: Full-stack deployment option

### Environment Variables for Production
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=production_cloud_name
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=production_google_client_id
```

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**
   - Clear `.next` folder and rebuild
   - Check for TypeScript errors
   - Verify all dependencies are installed

2. **API Connection Issues**
   - Verify API URL in environment variables
   - Check CORS configuration on backend
   - Ensure backend server is running

3. **Cloudinary Issues**
   - Verify cloud name in environment variables
   - Check API key configuration
   - Ensure proper image domains in next.config.mjs

## 🤝 Contributing

1. Follow the established code style
2. Write meaningful commit messages
3. Test your changes thoroughly
4. Update documentation as needed
5. Submit pull requests for review

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Cloudinary React SDK](https://cloudinary.com/documentation/react_integration)