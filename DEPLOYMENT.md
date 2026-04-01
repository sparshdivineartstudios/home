# Deployment Guide

## Option 1: Render (Recommended for Full-Stack Apps)

### Why Render?
- Native support for Node.js backend + React frontend + MongoDB
- Easy deployment with individual services
- Free tier available
- Great for traditional Express.js apps

### Step 1: Create Render Account
Go to https://render.com and sign up for an account.

### Step 2: Deploy MongoDB Database
1. In Render dashboard, click "New" → "MongoDB"
2. Name it: `home-database`
3. Choose region (closest to you)
4. Click "Create Database"
5. Copy the connection string (Internal Database URL)

### Step 3: Deploy Backend API
1. In Render dashboard, click "New" → "Web Service"
2. Connect your GitHub repository (or upload manually)
3. Configure:
   - **Name**: `home-backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`
4. Add Environment Variables:
   ```
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<generate-a-secure-random-string>
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>
   GOOGLE_REFRESH_TOKEN=<your-google-refresh-token>
   GOOGLE_DRIVE_PARENT_FOLDER_ID=<your-drive-folder-id>
   FRONTEND_URL=https://home-frontend.onrender.com
   ```
5. Click "Create Web Service"

### Step 4: Deploy Frontend
1. In Render dashboard, click "New" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `home-frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variable:
   ```
   VITE_API_URL=https://home-8zob.onrender.com/api
   ```
5. Click "Create Static Site"

### Step 5: Update CORS
After deployment, update the FRONTEND_URL in backend environment variables to match your actual frontend URL.

### Step 6: Seed Database
After backend is deployed, you can seed the database by:
1. Going to your backend service in Render
2. Opening the shell
3. Running: `npm run seed`

## Option 2: Vercel (Frontend Only)

### Why Vercel?
- Excellent for React apps
- Fast deployments
- Good free tier
- But requires backend conversion to serverless functions

### Frontend Deployment:
1. Go to https://vercel.com and sign up
2. Connect your GitHub repository
3. Vercel will auto-detect React app
4. Add environment variable: `VITE_API_URL=https://your-backend-url.vercel.app/api`
5. Deploy

### Backend on Vercel:
Would require converting Express routes to Vercel serverless functions (api/ directory), which is more complex.

## Important Notes for Both:
- Make sure your Google Drive folder is shared properly
- Update image URLs in seed.js with actual Google Drive image IDs
- Test all functionality after deployment
- Monitor logs for any issues

## URLs after deployment (Render):
- Frontend: https://home-frontend.onrender.com
- Backend: https://home-8zob.onrender.com
- Database: Internal MongoDB connection