const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: Number,
    required: true,
    min: 0
  },
  explanation: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 10
  }
});

const trainingModuleSchema = new mongoose.Schema({
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
    enum: ['video', 'quiz', 'interactive', 'document'],
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 1
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  category: {
    type: String,
    enum: ['segregation', 'composting', 'recycling', 'safety', 'awareness', 'technology'],
    required: true
  },
  content: {
    videoUrl: String,
    documentUrl: String,
    interactiveContent: mongoose.Schema.Types.Mixed,
    quizQuestions: [quizQuestionSchema],
    materials: [String],
    resources: [{
      title: String,
      url: String,
      type: {
        type: String,
        enum: ['pdf', 'video', 'article', 'infographic']
      }
    }]
  },
  requiredFor: [{
    type: String,
    enum: ['citizen', 'waste_worker', 'green_champion', 'ulb_admin'],
    required: true
  }],
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainingModule'
  }],
  learningObjectives: [String],
  completionCriteria: {
    minimumScore: {
      type: Number,
      default: 70,
      min: 0,
      max: 100
    },
    requiredWatchTime: {
      type: Number, // percentage of video that must be watched
      default: 80,
      min: 0,
      max: 100
    }
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  version: {
    type: String,
    default: '1.0'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  statistics: {
    totalEnrollments: {
      type: Number,
      default: 0
    },
    totalCompletions: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    },
    totalRatings: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for completion rate
trainingModuleSchema.virtual('completionRate').get(function() {
  if (this.statistics.totalEnrollments === 0) return 0;
  return Math.round((this.statistics.totalCompletions / this.statistics.totalEnrollments) * 100);
});

// Virtual for estimated reading time (for document type)
trainingModuleSchema.virtual('estimatedReadingTime').get(function() {
  if (this.type === 'document' && this.content.materials) {
    // Estimate 200 words per minute reading speed
    const totalWords = this.content.materials.join(' ').split(' ').length;
    return Math.ceil(totalWords / 200);
  }
  return this.duration;
});

// Method to update statistics
trainingModuleSchema.methods.updateStatistics = function(type, value = 1) {
  switch (type) {
    case 'enrollment':
      this.statistics.totalEnrollments += value;
      break;
    case 'completion':
      this.statistics.totalCompletions += value;
      break;
    case 'score':
      // Update average score
      const totalScore = this.statistics.averageScore * this.statistics.totalCompletions;
      this.statistics.averageScore = (totalScore + value) / (this.statistics.totalCompletions + 1);
      break;
    case 'rating':
      // Update average rating
      const totalRating = this.statistics.averageRating * this.statistics.totalRatings;
      this.statistics.totalRatings += 1;
      this.statistics.averageRating = (totalRating + value) / this.statistics.totalRatings;
      break;
  }
  return this.save();
};

// Static method to get modules by role
trainingModuleSchema.statics.getByRole = function(role) {
  return this.find({
    requiredFor: role,
    isActive: true
  }).sort({ difficulty: 1, createdAt: 1 });
};

// Static method to get recommended modules
trainingModuleSchema.statics.getRecommended = function(userId, role, completedModules = []) {
  return this.find({
    _id: { $nin: completedModules },
    requiredFor: role,
    isActive: true,
    prerequisites: { $size: 0 } // Start with modules that have no prerequisites
  }).sort({ statistics.averageRating: -1 }).limit(5);
};

// Indexes
trainingModuleSchema.index({ requiredFor: 1 });
trainingModuleSchema.index({ category: 1 });
trainingModuleSchema.index({ difficulty: 1 });
trainingModuleSchema.index({ isActive: 1 });
trainingModuleSchema.index({ 'statistics.averageRating': -1 });

module.exports = mongoose.model('TrainingModule', trainingModuleSchema);