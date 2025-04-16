Read this Health-Consultation-Admin-Dashboard.jsx code file in depth to fully understand it. Once understood, create a proper page in client src , where it should be according to next.js

Structure the common, componenets, layouts, folder structure and other things properly that also supports dynamic routes: (auth)

Improve the UI disign all pages in (auth) for mobile devices. Make it attractive as well as responsive.


Set up a Google OAuth Client ID:

- Go to the Google Cloud Console
- Create a new project or select an existing one
- Navigate to "APIs & Services" > "Credentials"
- Click "Create Credentials" > "OAuth client ID"
- Set up the OAuth consent screen
- For Application type, select "Web application"
- Add authorized JavaScript origins (e.g., http://localhost:3000 )
- Add authorized redirect URIs (e.g., http://localhost:3000/login/success )
- Copy the Client ID and add it to your environment variables