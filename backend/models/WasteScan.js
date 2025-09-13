const mongoose = require('mongoose');

const wasteScanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  imagePublicId: String, // For Cloudinary
  wasteTypes: [{
    type: {
      type: String,
      enum: ['plastic', 'organic', 'paper', 'metal', 'glass', 'ewaste', 'hazardous', 'textile', 'general'],
      required: true
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100
    }
  }],
  primaryWasteType: {
    type: String,
    enum: ['plastic', 'organic', 'paper', 'metal', 'glass', 'ewaste', 'hazardous', 'textile', 'general'],
    required: true
  },
  overallConfidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  pointsEarned: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      index: '2dsphere'
    },
    address: String,
    area: String,
    city: String,
    state: String
  },
  geoTagged: {
    type: Boolean,
    default: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  reportedIssue: {
    reported: {
      type: Boolean,
      default: false
    },
    reason: String,
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reportedAt: Date,
    resolved: {
      type: Boolean,
      default: false
    },
    resolvedAt: Date
  },
  aiAnalysis: {
    imageSize: String,
    processingTime: Number, // in milliseconds
    textureComplexity: Number,
    edgeCount: Number,
    brightnessVariation: Number,
    colorAnalysis: {
      plastic: Number,
      organic: Number,
      paper: Number,
      metal: Number,
      glass: Number,
      ewaste: Number,
      hazardous: Number,
      textile: Number
    },
    modelVersion: {
      type: String,
      default: '1.0'
    }
  },
  disposalRecommendations: [{
    wasteType: String,
    recommendation: String,
    binColor: String,
    specialInstructions: String
  }],
  challengeContributions: [{
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge'
    },
    pointsContributed: Number
  }],
  status: {
    type: String,
    enum: ['pending', 'processed', 'verified', 'disputed'],
    default: 'processed'
  },
  metadata: {
    deviceInfo: String,
    appVersion: String,
    scanDuration: Number, // Time taken to scan in seconds
    retryCount: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for scan age
wasteScanSchema.virtual('scanAge').get(function() {
  return Date.now() - this.createdAt;
});

// Virtual for primary waste type details
wasteScanSchema.virtual('primaryWasteDetails').get(function() {
  return this.wasteTypes.find(wt => wt.type === this.primaryWasteType);
});

// Pre-save middleware to calculate points
wasteScanSchema.pre('save', function(next) {
  if (this.isNew) {
    // Calculate points based on waste types detected
    const pointsMap = {
      plastic: 10,
      organic: 6,
      paper: 8,
      metal: 12,
      glass: 15,
      ewaste: 20,
      hazardous: 25,
      textile: 8,
      general: 5
    };
    
    let totalPoints = 0;
    this.wasteTypes.forEach(wasteType => {
      const basePoints = pointsMap[wasteType.type] || 5;
      // Bonus points for high confidence
      const confidenceBonus = wasteType.confidence > 80 ? 2 : 0;
      totalPoints += basePoints + confidenceBonus;
    });
    
    // Bonus for geo-tagging
    if (this.geoTagged) {
      totalPoints += 2;
    }
    
    this.pointsEarned = totalPoints;
  }
  next();
});

// Static method to get scan statistics
wasteScanSchema.statics.getStatistics = function(userId, timeframe = '30d') {
  const matchStage = userId ? { userId: mongoose.Types.ObjectId(userId) } : {};
  
  // Add time filter
  if (timeframe !== 'all') {
    const days = parseInt(timeframe.replace('d', ''));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    matchStage.createdAt = { $gte: startDate };
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalScans: { $sum: 1 },
        totalPoints: { $sum: '$pointsEarned' },
        averageConfidence: { $avg: '$overallConfidence' },
        wasteTypeBreakdown: {
          $push: '$primaryWasteType'
        },
        verifiedScans: {
          $sum: { $cond: ['$verified', 1, 0] }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalScans: 1,
        totalPoints: 1,
        averageConfidence: { $round: ['$averageConfidence', 2] },
        verificationRate: {
          $round: [
            { $multiply: [{ $divide: ['$verifiedScans', '$totalScans'] }, 100] },
            2
          ]
        },
        wasteTypeBreakdown: 1
      }
    }
  ]);
};

// Static method to get leaderboard
wasteScanSchema.statics.getLeaderboard = function(timeframe = '30d', limit = 10) {
  const matchStage = {};
  
  if (timeframe !== 'all') {
    const days = parseInt(timeframe.replace('d', ''));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    matchStage.createdAt = { $gte: startDate };
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$userId',
        totalScans: { $sum: 1 },
        totalPoints: { $sum: '$pointsEarned' },
        averageConfidence: { $avg: '$overallConfidence' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 0,
        userId: '$_id',
        name: '$user.name',
        avatar: '$user.avatar',
        totalScans: 1,
        totalPoints: 1,
        averageConfidence: { $round: ['$averageConfidence', 2] }
      }
    },
    { $sort: { totalPoints: -1 } },
    { $limit: limit }
  ]);
};

// Indexes for performance
wasteScanSchema.index({ userId: 1, createdAt: -1 });
wasteScanSchema.index({ 'location.coordinates': '2dsphere' });
wasteScanSchema.index({ primaryWasteType: 1 });
wasteScanSchema.index({ verified: 1 });
wasteScanSchema.index({ createdAt: -1 });
wasteScanSchema.index({ pointsEarned: -1 });

module.exports = mongoose.model('WasteScan', wasteScanSchema);