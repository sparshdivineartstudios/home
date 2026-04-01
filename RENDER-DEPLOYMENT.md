# 🚀 Home App - Render Deployment Checklist

## ✅ Completed:
- [x] MongoDB Atlas database set up
- [x] Backend API working locally
- [x] Frontend working locally
- [x] Environment variables configured

## 🔄 Next Steps:

### 1. Set up Google Drive API (Required for image uploads)
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Enable Google Drive API
- [ ] Create OAuth 2.0 credentials
- [ ] Get refresh token from [OAuth Playground](https://developers.google.com/oauthplayground)
- [ ] Update `.env` and `.env.render` files with credentials

### 2. Create Google Drive Folder
- [ ] Create main folder in Google Drive for products
- [ ] Get folder ID from URL
- [ ] Update `GOOGLE_DRIVE_PARENT_FOLDER_ID` in env files

### 3. Deploy to Render

#### Backend Deployment:
1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name**: `home-backend`
   - **Runtime**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables from `.env.render` file
6. Deploy!

#### Frontend Deployment:
1. Click "New" → "Static Site"
2. Connect your GitHub repo
3. Configure:
   - **Name**: `home-frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. Add environment variable:
   - `VITE_API_URL=https://home-backend.onrender.com/api`
5. Deploy!

### 4. Update Frontend API URL
- [ ] Update `src/contexts/AuthContext.tsx` API_BASE to production URL
- [ ] Or set `VITE_API_URL` environment variable in Render

### 5. Test Production Deployment
- [ ] Test user registration/login
- [ ] Test product browsing
- [ ] Test admin product creation (once Google Drive is set up)

## 📝 Important Notes:
- Generate a secure JWT_SECRET for production (use a password generator)
- Keep Google Drive credentials secure
- Test all features locally before deploying
- Monitor Render logs for any issues

## 🔗 Useful Links:
- [Render Dashboard](https://dashboard.render.com)
- [MongoDB Atlas](https://cloud.mongodb.com)
- [Google Cloud Console](https://console.cloud.google.com)
- [OAuth Playground](https://developers.google.com/oauthplayground)