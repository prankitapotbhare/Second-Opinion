# Implementation Documentation

## Client

## Mock Data Generation
- Mock data generation is implemented in `@/data`

### Authentication System
- Authentication is fully implemented across all pages, with the exception of Google OAuth integration.
- Implementation Flow:
  - Auth Pages → AuthContext → auth.api
- AuthContext manages all authentication state, including access and refresh tokens
- To complete Google OAuth integration, API tokens need to be added to environment files (.env) in both client and server directories. Refer `docs/GoogleOAuth.md

### User Management
- Patient data in response pages is currently mocked via `@/contexts/PatientContext.jsx`
- All user-related functionality is centralized in PatientContext for easier management
- `@/contexts/PatientContext.jsx` retrieves data from `@/api/patient.api`
- Current implementation uses mock data generation; final implementation will interact with backend APIs

### Administration
- Basic administrative functions have been created in `@/context/AdminContext`
- API integration for admin functions is pending implementation

### Doctor Portal
- Implementation needed in `@/context/DoctorContext` with corresponding `@/api/doctor.api`
- User flow:
  - After signup: Doctor redirected to portal
  - After login: Doctor redirected to dashboard

## Server

### Backend Implementation
- Authentication system is fully implemented
- Google OAuth integration requires API tokens to be added to environment files (.env) in both client and server directories
- Basic user and admin routes/services have been created

### Administrative Tools
- To create an admin account: `npm run create-admin`
- To generate JWT tokens: `npm run generate-jwt`