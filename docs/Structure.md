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