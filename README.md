# GreenTrack - AI Powered Waste Segregation & Recycling App

🌱 **SIH 2025 Hackathon Project**

GreenTrack is a comprehensive web application that leverages AI to help users properly identify, segregate, and dispose of waste while gamifying the experience through rewards, challenges, and community engagement.

## 🚀 Features

### Core Functionality
- **AI Waste Scanner**: Upload or capture images of waste items to get AI-powered classification
- **Smart Disposal Guide**: Get detailed instructions on how to properly dispose of different waste types
- **Gamification System**: Earn eco-points, unlock badges, and level up through proper waste management
- **Community Challenges**: Participate in individual and community-wide environmental challenges
- **Real-time Leaderboards**: Compete with other users and communities globally

### User Features
- **User Authentication**: Secure login/signup system with profile management
- **Mobile-First Design**: Responsive design optimized for smartphone usage
- **Progress Tracking**: Monitor your environmental impact and scanning history
- **Achievement System**: Unlock badges and achievements for various milestones
- **Social Features**: Join communities and participate in group challenges

### Admin Features
- **Analytics Dashboard**: Comprehensive dashboard for monitoring app usage and impact
- **User Management**: Manage users, communities, and permissions
- **Challenge Management**: Create and manage community challenges
- **Real-time Monitoring**: Track system health and user engagement metrics

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **Charts**: Chart.js with React Chart.js 2
- **Icons**: Lucide React
- **Camera**: React Camera Pro
- **Notifications**: React Hot Toast
- **Build Tool**: Vite

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.tsx      # Main app layout with navigation
├── contexts/           # React context providers
│   ├── AuthContext.tsx # Authentication state management
│   └── DataContext.tsx # Application data management
├── pages/              # Main application pages
│   ├── Login.tsx       # Authentication page
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Scanner.tsx     # AI waste scanner interface
│   ├── Rewards.tsx     # Rewards and achievements
│   ├── Community.tsx   # Community challenges and leaderboards
│   ├── Profile.tsx     # User profile management
│   └── Admin.tsx       # Admin dashboard
└── App.tsx            # Main application component
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd greentrack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Demo Credentials

For testing purposes, you can use these demo credentials:

- **Regular User**: `user@demo.com` (any password)
- **Admin User**: `admin@demo.com` (any password)

## 🎯 Key Features Walkthrough

### 1. AI Waste Scanner
- Take photos or upload images of waste items
- Get AI-powered classification with confidence scores
- Receive detailed disposal instructions and recycling tips
- Earn eco-points for each successful scan

### 2. Gamification System
- **Eco-Points**: Earned through scanning and proper disposal
- **Levels**: Progress through levels based on accumulated points
- **Badges**: Unlock achievements for various milestones
- **Leaderboards**: Global and community rankings

### 3. Community Features
- Join community challenges (individual and group)
- Compete with other users and communities
- Track community-wide environmental impact
- Share achievements and progress

### 4. Admin Dashboard
- Monitor user engagement and app usage
- Track waste scanning patterns and trends
- Manage users, communities, and challenges
- Export reports and analytics

## 🌟 Waste Categories Supported

The AI system can identify and provide guidance for:

- **Plastic** (10 points) - Bottles, containers, packaging
- **Paper** (8 points) - Documents, cardboard, newspapers
- **Organic** (6 points) - Food waste, garden waste
- **Metal** (12 points) - Cans, foil, metal containers
- **E-Waste** (20 points) - Electronics, batteries, cables
- **Glass** (15 points) - Bottles, jars, broken glass

## 📱 Mobile Experience

GreenTrack is designed with a mobile-first approach:

- **Responsive Design**: Optimized for all screen sizes
- **Touch-Friendly**: Large buttons and intuitive gestures
- **Camera Integration**: Direct camera access for waste scanning
- **Offline Capability**: Core features work without internet
- **Push Notifications**: Reminders and eco-tips (planned)

## 🔒 Security Features

- **Secure Authentication**: Encrypted user credentials
- **Data Privacy**: User data protection and privacy controls
- **Role-Based Access**: Different permission levels for users and admins
- **Secure Image Handling**: Safe image upload and processing

## 🌐 Deployment Options

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Deployment Platforms
- **Vercel**: Recommended for easy deployment
- **Netlify**: Alternative hosting platform
- **Firebase Hosting**: Google's hosting solution
- **GitHub Pages**: Free hosting for open-source projects

## 📈 Future Enhancements

### Phase 2 Features
- **Real AI Integration**: TensorFlow.js model for offline classification
- **Firebase Backend**: Real database and authentication
- **Push Notifications**: Eco-tips and reminders
- **Reward Redemption**: Partner with local businesses for rewards
- **IoT Integration**: Smart bin sensors and alerts
- **Multi-language Support**: Localization for global reach

### Phase 3 Features
- **Blockchain Rewards**: Crypto-based reward system
- **Carbon Footprint Tracking**: Detailed environmental impact metrics
- **Corporate Partnerships**: Integration with waste management companies
- **AI Improvement**: Continuous model training and improvement
- **Global Scaling**: Multi-region support and localization

## 🤝 Contributing

We welcome contributions to GreenTrack! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **SIH 2025**: For providing the platform and inspiration
- **React Community**: For the amazing ecosystem and tools
- **Environmental Organizations**: For guidance on waste management best practices
- **Open Source Contributors**: For the libraries and tools that made this possible

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

---

**Made with 💚 for a cleaner, greener future**

*GreenTrack - Where Technology Meets Sustainability*