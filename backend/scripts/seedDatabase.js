const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('../models/User');
const TrainingModule = require('../models/TrainingModule');
const Challenge = require('../models/Challenge');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/greentrack');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Seed users
const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});

    const users = [
      {
        name: 'Admin User',
        email: 'admin@greentrack.com',
        password: 'admin123',
        role: 'admin',
        ecoPoints: 5000,
        level: 10,
        location: {
          coordinates: [77.2090, 28.6139],
          address: 'New Delhi, India',
          area: 'Central Delhi',
          city: 'New Delhi',
          state: 'Delhi'
        }
      },
      {
        name: 'Green Champion',
        email: 'champion@greentrack.com',
        password: 'champion123',
        role: 'green_champion',
        ecoPoints: 3000,
        level: 7,
        location: {
          coordinates: [77.2090, 28.6139],
          address: 'Connaught Place, New Delhi',
          area: 'Central Delhi',
          city: 'New Delhi',
          state: 'Delhi'
        }
      },
      {
        name: 'Waste Worker',
        email: 'worker@greentrack.com',
        password: 'worker123',
        role: 'waste_worker',
        ecoPoints: 2000,
        level: 5,
        location: {
          coordinates: [77.2090, 28.6139],
          address: 'Khan Market, New Delhi',
          area: 'Central Delhi',
          city: 'New Delhi',
          state: 'Delhi'
        }
      },
      {
        name: 'John Citizen',
        email: 'citizen@greentrack.com',
        password: 'citizen123',
        role: 'citizen',
        ecoPoints: 1250,
        level: 3,
        totalScans: 47,
        location: {
          coordinates: [77.2090, 28.6139],
          address: 'Lajpat Nagar, New Delhi',
          area: 'South Delhi',
          city: 'New Delhi',
          state: 'Delhi'
        }
      }
    ];

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${user.email}`);
    }

    console.log('Users seeded successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

// Seed training modules
const seedTrainingModules = async () => {
  try {
    // Clear existing modules
    await TrainingModule.deleteMany({});

    const modules = [
      {
        title: 'Waste Management Fundamentals',
        description: 'Master the basics of waste management, environmental impact, and the circular economy principles',
        type: 'video',
        duration: 20,
        difficulty: 'beginner',
        category: 'segregation',
        content: {
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          materials: [
            'Understanding the waste hierarchy: Reduce, Reuse, Recycle, Recover',
            'Global waste statistics and environmental impact',
            'Introduction to circular economy principles',
            'Types of waste: Municipal, Industrial, Hazardous, E-waste'
          ]
        },
        requiredFor: ['citizen', 'waste_worker', 'green_champion'],
        learningObjectives: [
          'Understand the environmental impact of waste',
          'Learn the waste hierarchy principles',
          'Identify different types of waste'
        ]
      },
      {
        title: 'Advanced Waste Segregation Techniques',
        description: 'Learn professional-grade waste segregation methods and color-coding systems',
        type: 'interactive',
        duration: 25,
        difficulty: 'intermediate',
        category: 'segregation',
        content: {
          materials: [
            'Multi-stream segregation: 5-bin system implementation',
            'Color coding standards: Green, Blue, Yellow, Red, Black bins',
            'Wet waste identification and handling',
            'Dry recyclable waste sorting techniques'
          ]
        },
        requiredFor: ['citizen', 'waste_worker', 'green_champion'],
        learningObjectives: [
          'Master the 5-bin segregation system',
          'Understand color coding standards',
          'Practice proper sorting techniques'
        ]
      },
      {
        title: 'Plastic Waste Management & Recycling',
        description: 'Comprehensive guide to plastic types, recycling codes, and proper disposal methods',
        type: 'quiz',
        duration: 30,
        difficulty: 'intermediate',
        category: 'recycling',
        content: {
          quizQuestions: [
            {
              question: 'Which plastic recycling code indicates PET bottles commonly used for beverages?',
              options: ['Code 1 (PET)', 'Code 2 (HDPE)', 'Code 3 (PVC)', 'Code 4 (LDPE)'],
              correctAnswer: 0,
              explanation: 'PET (Polyethylene Terephthalate) bottles have recycling code 1 and are highly recyclable.'
            },
            {
              question: 'What is the most important step before recycling plastic containers?',
              options: ['Breaking them into pieces', 'Removing labels completely', 'Cleaning thoroughly', 'Sorting by color'],
              correctAnswer: 2,
              explanation: 'Cleaning plastic containers thoroughly removes contaminants and makes recycling more effective.'
            }
          ]
        },
        requiredFor: ['citizen', 'waste_worker'],
        learningObjectives: [
          'Identify plastic recycling codes',
          'Understand proper cleaning procedures',
          'Learn recycling best practices'
        ]
      }
    ];

    for (const moduleData of modules) {
      const module = new TrainingModule(moduleData);
      await module.save();
      console.log(`Created training module: ${module.title}`);
    }

    console.log('Training modules seeded successfully');
  } catch (error) {
    console.error('Error seeding training modules:', error);
  }
};

// Seed challenges
const seedChallenges = async () => {
  try {
    // Clear existing challenges
    await Challenge.deleteMany({});

    // Get a user to be the creator
    const creator = await User.findOne({ role: 'admin' });

    const challenges = [
      {
        title: 'Plastic Free Week',
        description: 'Scan and properly dispose of 20 plastic items this week',
        type: 'individual',
        category: 'segregation',
        targetMetric: 'scans',
        targetAmount: 20,
        currentAmount: 0,
        reward: {
          points: 100,
          badge: 'plastic-warrior'
        },
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        createdBy: creator._id,
        status: 'active',
        eligibility: {
          roles: ['citizen', 'waste_worker', 'green_champion']
        }
      },
      {
        title: 'Community Clean Drive',
        description: 'Our community goal: 500 total scans this month',
        type: 'community',
        category: 'collection',
        targetMetric: 'scans',
        targetAmount: 500,
        currentAmount: 347,
        reward: {
          points: 250,
          badge: 'community-hero'
        },
        startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        createdBy: creator._id,
        status: 'active',
        eligibility: {
          roles: ['citizen', 'waste_worker', 'green_champion']
        }
      }
    ];

    for (const challengeData of challenges) {
      const challenge = new Challenge(challengeData);
      await challenge.save();
      console.log(`Created challenge: ${challenge.title}`);
    }

    console.log('Challenges seeded successfully');
  } catch (error) {
    console.error('Error seeding challenges:', error);
  }
};

// Main seed function
const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('Starting database seeding...');
    
    await seedUsers();
    await seedTrainingModules();
    await seedChallenges();
    
    console.log('Database seeding completed successfully!');
    
    console.log('\n=== Demo Credentials ===');
    console.log('Admin: admin@greentrack.com / admin123');
    console.log('Green Champion: champion@greentrack.com / champion123');
    console.log('Waste Worker: worker@greentrack.com / worker123');
    console.log('Citizen: citizen@greentrack.com / citizen123');
    console.log('========================\n');
    
  } catch (error) {
    console.error('Database seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;