# Home App Setup Guide

## 1. MongoDB Atlas Setup (Free Cloud Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new project called "home-app"
4. Create a free cluster (M0 - Free tier)
5. Set up database access:
   - Go to Database Access
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create user: `homeuser` with a strong password
6. Set up network access:
   - Go to Network Access
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
7. Get connection string:
   - Go to Clusters → Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>` and `<password>` with your database user credentials

## 2. Google Drive API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Drive API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Drive API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs: `https://developers.google.com/oauthplayground`
5. Get refresh token:
   - Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground)
   - Click gear icon (settings)
   - Enter your Client ID and Client Secret
   - Select "https://www.googleapis.com/auth/drive" scope
   - Click "Authorize APIs"
   - Exchange authorization code for tokens
   - Copy the refresh token

## 3. Environment Setup

1. Copy `.env.example` to `.env` in the backend folder
2. Fill in all the values:
   - MONGODB_URI: Your MongoDB Atlas connection string
   - GOOGLE_CLIENT_ID: From Google Cloud Console
   - GOOGLE_CLIENT_SECRET: From Google Cloud Console
   - GOOGLE_REFRESH_TOKEN: From OAuth Playground

## 4. Google Drive Folder Setup

1. Create a main folder in Google Drive for your app
2. Share it with your service account email (if using service account) or keep it accessible
3. Note the folder ID from the URL (the long string after /folders/)

## 5. Render Deployment

1. Create Render account at [render.com](https://render.com)
2. Connect your GitHub repository
3. Create a new Web Service
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables in Render dashboard (same as .env but without FRONTEND_URL for local dev)
7. Deploy!

## 6. Testing

1. Start MongoDB locally (if not using Atlas):
   ```bash
   mongod
   ```
2. Start backend:
   ```bash
   cd backend
   npm run dev
   ```
3. Start frontend:
   ```bash
   npm run dev
   ```
4. Test API: http://localhost:5000/api/products