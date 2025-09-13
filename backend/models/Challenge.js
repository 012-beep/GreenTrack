const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['individual', 'community', 'area', 'city', 'global'],
    required: true
  },
  category: {
    type: String,
    enum: ['segregation', 'collection', 'recycling', 'awareness', 'reduction', 'composting'],
    required: true
  },
  targetMetric: {
    type: String,
    enum: ['scans', 'points', 'weight', 'participants', 'days'],
    required: true
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 1
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  reward: {
    points: {
      type: Number,
      required: true,
      min: 0
    },
    badge: String,
    certificate: String,
    physicalReward: String
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    contribution: {
      type: Number,
      default: 0
    },
    lastActivity: Date
  }],
  area: {
    name: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    },
    radius: Number // in kilometers
  },
  rules: [String],
  eligibility: {
    roles: [{
      type: String,
      enum: ['citizen', 'waste_worker', 'green_champion', 'ulb_admin']
    }],
    minLevel: {
      type: Number,
      default: 1
    },
    minPoints: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'cancelled'],
    default: 'draft'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  featured: {
    type: Boolean,
    default: false
  },
  image: String,
  leaderboard: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rank: Number,
    contribution: Number,
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }],
  milestones: [{
    percentage: Number,
    title: String,
    description: String,
    reward: {
      points: Number,
      badge: String
    },
    achieved: {
      type: Boolean,
      default: false
    },
    achievedAt: Date
  }],
  statistics: {
    totalParticipants: {
      type: Number,
      default: 0
    },
    averageContribution: {
      type: Number,
      default: 0
    },
    topContributor: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      contribution: Number
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for progress percentage
challengeSchema.virtual('progressPercentage').get(function() {
  return Math.min(Math.round((this.currentAmount / this.targetAmount) * 100), 100);
});

// Virtual for time remaining
challengeSchema.virtual('timeRemaining').get(function() {
  const now = new Date();
  const end = new Date(this.endDate);
  const diff = end - now;
  
  if (diff <= 0) return { expired: true };
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  return { days, hours, expired: false };
});

// Virtual for challenge status
challengeSchema.virtual('isActive').get(function() {
  const now = new Date();
  return this.status === 'active' && 
         new Date(this.startDate) <= now && 
         new Date(this.endDate) > now;
});

// Method to join challenge
challengeSchema.methods.joinChallenge = function(userId) {
  const existingParticipant = this.participants.find(p => p.userId.toString() === userId.toString());
  
  if (existingParticipant) {
    throw new Error('User already participating in this challenge');
  }
  
  this.participants.push({
    userId,
    joinedAt: new Date(),
    contribution: 0
  });
  
  this.statistics.totalParticipants = this.participants.length;
  return this.save();
};

// Method to update contribution
challengeSchema.methods.updateContribution = function(userId, amount) {
  const participant = this.participants.find(p => p.userId.toString() === userId.toString());
  
  if (!participant) {
    throw new Error('User not participating in this challenge');
  }
  
  participant.contribution += amount;
  participant.lastActivity = new Date();
  this.currentAmount += amount;
  
  // Update statistics
  this.statistics.averageContribution = this.participants.reduce((sum, p) => sum + p.contribution, 0) / this.participants.length;
  
  // Update top contributor
  const topParticipant = this.participants.reduce((top, current) => 
    current.contribution > (top?.contribution || 0) ? current : top
  );
  
  this.statistics.topContributor = {
    userId: topParticipant.userId,
    contribution: topParticipant.contribution
  };
  
  // Update leaderboard
  this.updateLeaderboard();
  
  // Check milestones
  this.checkMilestones();
  
  return this.save();
};

// Method to update leaderboard
challengeSchema.methods.updateLeaderboard = function() {
  const sortedParticipants = this.participants
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 10); // Top 10
  
  this.leaderboard = sortedParticipants.map((participant, index) => ({
    userId: participant.userId,
    rank: index + 1,
    contribution: participant.contribution,
    lastUpdated: new Date()
  }));
};

// Method to check milestones
challengeSchema.methods.checkMilestones = function() {
  const progressPercentage = (this.currentAmount / this.targetAmount) * 100;
  
  this.milestones.forEach(milestone => {
    if (!milestone.achieved && progressPercentage >= milestone.percentage) {
      milestone.achieved = true;
      milestone.achievedAt = new Date();
      
      // Award milestone rewards to all participants
      // This would trigger a notification/reward system
    }
  });
};

// Static method to get active challenges
challengeSchema.statics.getActiveChallenges = function(userId, userRole, userLocation) {
  const now = new Date();
  const query = {
    status: 'active',
    startDate: { $lte: now },
    endDate: { $gt: now }
  };
  
  // Filter by user role eligibility
  if (userRole) {
    query['eligibility.roles'] = userRole;
  }
  
  // Add location-based filtering for area/city challenges
  if (userLocation && userLocation.coordinates) {
    query.$or = [
      { type: { $in: ['individual', 'global'] } },
      {
        type: { $in: ['area', 'city'] },
        'area.coordinates': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: userLocation.coordinates
            },
            $maxDistance: 50000 // 50km radius
          }
        }
      }
    ];
  }
  
  return this.find(query)
    .populate('createdBy', 'name avatar')
    .sort({ featured: -1, createdAt: -1 });
};

// Static method to get user's challenges
challengeSchema.statics.getUserChallenges = function(userId) {
  return this.find({
    'participants.userId': userId
  })
  .populate('createdBy', 'name avatar')
  .sort({ endDate: 1 });
};

// Pre-save middleware to update status
challengeSchema.pre('save', function(next) {
  const now = new Date();
  
  if (this.status === 'active') {
    if (now > this.endDate) {
      this.status = 'completed';
    } else if (this.currentAmount >= this.targetAmount) {
      this.status = 'completed';
    }
  }
  
  next();
});

// Indexes
challengeSchema.index({ status: 1, startDate: 1, endDate: 1 });
challengeSchema.index({ type: 1 });
challengeSchema.index({ category: 1 });
challengeSchema.index({ 'participants.userId': 1 });
challengeSchema.index({ 'area.coordinates': '2dsphere' });
challengeSchema.index({ featured: -1, createdAt: -1 });

module.exports = mongoose.model('Challenge', challengeSchema);