# Google OAuth Setup for Second Opinion

This guide provides detailed instructions for setting up Google OAuth authentication for the Second Opinion application.

## 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click "New Project"
4. Enter "Second Opinion" as the project name
5. Select an organization (if applicable)
6. Click "Create"

## 2. Configure the OAuth Consent Screen

1. In your new project, navigate to "APIs & Services" > "OAuth consent screen"
2. Select "External" as the user type (unless you have a Google Workspace account)
3. Click "Create"
4. Fill in the required application information:
   - App name: Second Opinion
   - User support email: [Your support email]
   - Developer contact information: [Your email]
5. Click "Save and Continue"
6. Under "Scopes", add the following scopes:
   - `./auth/userinfo.email`
   - `./auth/userinfo.profile`
7. Click "Save and Continue"
8. Add test users if you're still in testing (optional)
9. Click "Save and Continue"
10. Review your settings and click "Back to Dashboard"

## 3. Create OAuth Client ID

1. Navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. For Application type, select "Web application"
4. Name: "Second Opinion Web Client"
5. Add Authorized JavaScript origins:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com` (replace with your actual domain)
6. Add Authorized redirect URIs:
   - Development: `http://localhost:3000/login`
   - Production: `https://yourdomain.com/login` (replace with your actual domain)
7. Click "Create"
8. A modal will appear with your Client ID and Client Secret - save these securely

## 4. Configure Environment Variables

1. In your project's `.env` file, add the following variables:
   ```
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   GOOGLE_CALLBACK_URL=http://localhost:3000/login
   ```
2. For production, update the callback URL accordingly

## 5. Enable Google Sign-In in Your Application

1. Install required packages:
   ```bash
   npm install passport passport-google-oauth20
   ```

2. Configure Passport.js in your server:
   ```javascript
   const passport = require('passport');
   const GoogleStrategy = require('passport-google-oauth20').Strategy;

   passport.use(new GoogleStrategy({
     clientID: process.env.GOOGLE_CLIENT_ID,
     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
     callbackURL: process.env.GOOGLE_CALLBACK_URL
   },
   function(accessToken, refreshToken, profile, done) {
     // Handle user authentication here
     // You can create or find a user in your database based on the Google profile
     return done(null, profile);
   }));
   ```

3. Add authentication routes:
   ```javascript
   app.get('/auth/google',
     passport.authenticate('google', { scope: ['profile', 'email'] }));

   app.get('/login', 
     passport.authenticate('google', { failureRedirect: '/login' }),
     function(req, res) {
       // Successful authentication, redirect home or generate JWT
       res.redirect('/');
     });
   ```

## 6. Testing

1. Start your application
2. Navigate to your login page
3. Click the "Sign in with Google" button
4. You should be redirected to Google's authentication page
5. After successful authentication, you should be redirected back to your application

## 7. Production Considerations

1. Update the authorized origins and redirect URIs in the Google Cloud Console to include your production domain
2. Update your environment variables with production values
3. Ensure your callback URL uses HTTPS in production
4. Consider implementing additional security measures like state parameters to prevent CSRF attacks
