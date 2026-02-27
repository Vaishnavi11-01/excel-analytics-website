# Deployment Guide for Excel Analytics Website

## Frontend Deployment (Netlify)

### Prerequisites
- Netlify account
- GitHub repository with your code

### Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Configure build settings:
     - **Base directory**: `frontend`
     - **Build command**: `npm run build`
     - **Publish directory**: `build`
   - Add environment variable:
     - `REACT_APP_API_URL`: `https://your-backend-url.onrender.com`
   - Click "Deploy site"

## Backend Deployment (Render)

### Prerequisites
- Render account
- MongoDB Atlas database

### Steps

1. **Setup MongoDB Atlas**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Create a database user
   - Get your connection string

2. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: excel-analytics-backend
     - **Root Directory**: `backend`
     - **Runtime**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   - Add Environment Variables:
     - `MONGODB_URI`: `your-mongodb-connection-string`
     - `JWT_SECRET`: `your-32-character-secret-key`
     - `NODE_ENV`: `production`
     - `FRONTEND_URI`: `https://your-netlify-site.netlify.app`
   - Click "Create Web Service"

## Post-Deployment Configuration

### Update CORS Settings
After deploying both services, update the CORS configuration in `backend/server.js`:

```javascript
app.use(cors({
  origin: ['https://your-netlify-site.netlify.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

### Update Frontend Environment
In Netlify dashboard, update the environment variable:
- `REACT_APP_API_URL`: `https://your-backend-url.onrender.com`

## Testing Your Deployment

1. Visit your Netlify site URL
2. Test user registration and login
3. Test file upload functionality
4. Verify all features work correctly

## Troubleshooting

### Common Issues
- **CORS errors**: Make sure your backend allows requests from your Netlify domain
- **Database connection**: Verify MongoDB URI is correct and IP is whitelisted
- **Build failures**: Check that all dependencies are installed correctly

### Environment Variables Checklist
- Backend: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV`, `FRONTEND_URI`
- Frontend: `REACT_APP_API_URL`
