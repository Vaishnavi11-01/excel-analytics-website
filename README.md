# Excel Analytics - MERN Stack Application

A professional Excel analytics website built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring JWT authentication, file upload, and data analysis/visualization capabilities.

Deployment at : https://excel-analytics-website.vercel.app/

## 🚀 Features

- **User Authentication**: Secure JWT-based login/registration system
- **File Upload**: Support for Excel/CSV files with multiple file upload
- **Data Visualization**: Interactive charts and analytics using Chart.js
- **Dark Mode**: Professional dark/light theme toggle
- **Responsive Design**: Modern UI with styled-components and framer-motion
- **File Management**: View, analyze, download, and delete uploaded files
- **Data Analysis**: Comprehensive data insights and statistics
- **Real-time Search**: Filter and search through uploaded data
- **Export Functionality**: Download processed data in various formats

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **XLSX** for Excel/CSV processing
- **Helmet** for security
- **CORS** for cross-origin requests

### Frontend
- **React.js** with hooks and context
- **Styled-components** for styling
- **Framer-motion** for animations
- **Chart.js** for data visualization
- **React Router** for navigation
- **React Hot Toast** for notifications
- **Context API** for state management

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
```

### Frontend Setup
```bash
cd frontend
npm install
```

## ⚙️ Environment Variables

### Backend (.env)
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
FRONTEND_URI=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
```

## 🚀 Running the Application

### Development Mode
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm start
```

### Production Mode
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
```

## 🌐 Deployment

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Build command: `npm install`
4. Start command: `npm start`

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Build command: `npm run build`
4. Output directory: `build`

### Environment Variables for Production
- **Render (Backend)**: Add `FRONTEND_URI=https://your-frontend-domain.vercel.app`
- **Vercel (Frontend)**: Add `REACT_APP_API_URL=https://your-backend.onrender.com`

## 📁 Project Structure

```
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.js
│   └── package.json
├── .gitignore
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### File Management
- `POST /api/excel/upload` - Upload Excel/CSV files
- `GET /api/excel/files` - Get user's files
- `GET /api/excel/files/:id` - Get specific file data
- `DELETE /api/excel/files/:id` - Delete file
- `GET /api/excel/download/:id` - Download file

## 🎨 Features in Detail

### Authentication System
- Secure JWT token-based authentication
- Protected routes and middleware
- User profile management

### File Upload & Processing
- Support for Excel (.xlsx, .xls) and CSV files
- Multiple file upload capability
- Automatic data parsing and validation
- File size and type validation

### Data Visualization
- Interactive charts (bar, line, pie, etc.)
- Real-time data filtering
- Export functionality
- Responsive chart layouts

### User Interface
- Modern, responsive design
- Dark/light theme toggle
- Smooth animations and transitions
- Professional color scheme
- Mobile-friendly layout

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- CORS configuration
- Rate limiting
- Helmet security headers
- Input validation and sanitization
