# GreenTrack Backend API

Backend API for GreenTrack - AI Powered Waste Management System

## 🚀 Features

- **User Authentication & Authorization** with JWT
- **Role-based Access Control** (Citizen, Waste Worker, Green Champion, Admin)
- **AI Waste Scanning** with image analysis
- **Training System** with modules, quizzes, and certificates
- **Challenge System** with individual and community challenges
- **Real-time Updates** with Socket.IO
- **Image Upload** with Cloudinary integration
- **Comprehensive API** with validation and error handling
- **Database Models** for all entities
- **Security Middleware** with rate limiting and helmet

## 🛠 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication tokens
- **Cloudinary** - Image storage and processing
- **Socket.IO** - Real-time communication
- **Multer** - File upload handling
- **Winston** - Logging
- **Helmet** - Security headers
- **Express Rate Limit** - Rate limiting

## 📁 Project Structure

```
backend/
├── config/
│   └── cloudinary.js          # Cloudinary configuration
├── middleware/
│   ├── auth.js                # Authentication middleware
│   └── errorHandler.js        # Global error handler
├── models/
│   ├── User.js                # User model
│   ├── WasteScan.js           # Waste scan model
│   ├── TrainingModule.js      # Training module model
│   └── Challenge.js           # Challenge model
├── routes/
│   ├── auth.js                # Authentication routes
│   ├── scans.js               # Waste scanning routes
│   ├── training.js            # Training routes
│   ├── challenges.js          # Challenge routes
│   ├── users.js               # User management routes
│   ├── facilities.js          # Facility routes
│   ├── penalties.js           # Penalty routes
│   ├── admin.js               # Admin routes
│   └── notifications.js       # Notification routes
├── scripts/
│   └── seedDatabase.js        # Database seeding script
├── logs/                      # Log files
├── uploads/                   # Local file uploads (if needed)
├── .env.example               # Environment variables template
├── server.js                  # Main server file
└── package.json               # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- MongoDB (local or cloud)
- Cloudinary account (for image uploads)

### Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/greentrack
   JWT_SECRET=your-super-secret-jwt-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/auth/register     # Register new user
POST /api/auth/login        # Login user
GET  /api/auth/me          # Get current user
PUT  /api/auth/profile     # Update profile
POST /api/auth/change-password # Change password
POST /api/auth/logout      # Logout user
```

### Waste Scanning Endpoints

```
POST /api/scans            # Create new waste scan
GET  /api/scans            # Get user's scans (paginated)
GET  /api/scans/statistics # Get scan statistics
GET  /api/scans/:id        # Get specific scan
PUT  /api/scans/:id/report # Report scan issue
DELETE /api/scans/:id      # Delete scan
```

### Training Endpoints

```
GET  /api/training/modules     # Get training modules
POST /api/training/enroll      # Enroll in module
PUT  /api/training/progress    # Update progress
POST /api/training/complete    # Complete module
GET  /api/training/certificates # Get certificates
```

### Challenge Endpoints

```
GET  /api/challenges           # Get active challenges
POST /api/challenges/join      # Join challenge
PUT  /api/challenges/progress  # Update challenge progress
GET  /api/challenges/leaderboard # Get leaderboard
```

### User Management Endpoints

```
GET  /api/users/profile        # Get user profile
PUT  /api/users/profile        # Update profile
GET  /api/users/leaderboard    # Get global leaderboard
POST /api/users/avatar         # Upload avatar
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 👥 User Roles

- **citizen** - Regular users who scan waste
- **waste_worker** - Professional waste handlers
- **green_champion** - Community leaders and monitors
- **ulb_admin** - Urban Local Body administrators
- **admin** - System administrators

## 📊 Database Models

### User Model
- Authentication and profile information
- Eco points and level system
- Location and preferences
- Streak tracking and badges

### WasteScan Model
- Image and AI analysis data
- Waste type detection results
- Location and verification status
- Challenge contributions

### TrainingModule Model
- Training content and materials
- Quiz questions and answers
- Completion criteria and statistics

### Challenge Model
- Challenge details and rules
- Participant tracking
- Progress monitoring and leaderboards

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Rate Limiting** to prevent abuse
- **Input Validation** with express-validator
- **Security Headers** with Helmet
- **Password Hashing** with bcrypt
- **Account Locking** after failed attempts
- **Role-based Authorization**

## 📝 Logging

The application uses Winston for comprehensive logging:
- Error logs: `logs/error.log`
- Combined logs: `logs/combined.log`
- Console output in development

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Use strong JWT secret
3. Configure production MongoDB URI
4. Set up Cloudinary for production
5. Configure proper CORS origins

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### PM2 Process Manager

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name "greentrack-api"

# Monitor
pm2 monit

# Restart
pm2 restart greentrack-api
```

## 📈 Monitoring

- **Health Check**: `GET /api/health`
- **Winston Logging** for error tracking
- **Performance Metrics** with built-in monitoring
- **Database Connection** monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation
- Review error logs
- Create an issue in the repository
- Contact the development team

---

**GreenTrack Backend API - Powering Sustainable Waste Management** 🌱