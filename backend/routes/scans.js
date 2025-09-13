const express = require('express');
const multer = require('multer');
const { body, validationResult, query } = require('express-validator');
const WasteScan = require('../models/WasteScan');
const User = require('../models/User');
const Challenge = require('../models/Challenge');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// AI Waste Detection Service (Mock implementation)
const analyzeWasteImage = async (imageBuffer) => {
  // This would integrate with actual AI service
  // For now, return mock analysis
  return new Promise((resolve) => {
    setTimeout(() => {
      const wasteTypes = ['plastic', 'organic', 'paper', 'metal', 'glass', 'ewaste'];
      const primaryType = wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
      const confidence = Math.floor(Math.random() * 40) + 60; // 60-100%
      
      const analysis = {
        wasteTypes: [
          {
            type: primaryType,
            confidence: confidence,
            percentage: Math.floor(Math.random() * 30) + 40
          }
        ],
        primaryWasteType: primaryType,
        overallConfidence: confidence,
        processingTime: Math.floor(Math.random() * 2000) + 1000,
        aiAnalysis: {
          imageSize: '1024x768',
          textureComplexity: Math.floor(Math.random() * 50) + 25,
          edgeCount: Math.floor(Math.random() * 30) + 10,
          brightnessVariation: Math.floor(Math.random() * 40) + 30,
          colorAnalysis: {
            plastic: Math.floor(Math.random() * 30),
            organic: Math.floor(Math.random() * 30),
            paper: Math.floor(Math.random() * 30),
            metal: Math.floor(Math.random() * 30),
            glass: Math.floor(Math.random() * 30),
            ewaste: Math.floor(Math.random() * 30)
          }
        }
      };
      
      resolve(analysis);
    }, 2500);
  });
};

// Generate disposal recommendations
const generateDisposalRecommendations = (wasteTypes) => {
  const recommendations = {
    plastic: {
      recommendation: 'Clean thoroughly and place in blue recycling bin',
      binColor: 'blue',
      specialInstructions: 'Remove labels if possible. Rinse containers to remove food residue.'
    },
    organic: {
      recommendation: 'Compost at home or use green bin for organic waste collection',
      binColor: 'green',
      specialInstructions: 'Separate from packaging. Can be used for home composting.'
    },
    paper: {
      recommendation: 'Remove any plastic coating and place in paper recycling bin',
      binColor: 'blue',
      specialInstructions: 'Keep dry and clean. Remove staples and plastic windows.'
    },
    metal: {
      recommendation: 'Clean and take to scrap dealer or metal recycling center',
      binColor: 'gray',
      specialInstructions: 'Remove labels. Aluminum cans are highly valuable for recycling.'
    },
    glass: {
      recommendation: 'Clean and place in glass recycling bin',
      binColor: 'white',
      specialInstructions: 'Handle carefully. Separate by color if required in your area.'
    },
    ewaste: {
      recommendation: 'Take to authorized e-waste collection center',
      binColor: 'red',
      specialInstructions: 'Remove personal data first. Never dispose in regular trash.'
    }
  };

  return wasteTypes.map(wasteType => ({
    wasteType: wasteType.type,
    ...recommendations[wasteType.type]
  }));
};

// @route   POST /api/scans
// @desc    Create a new waste scan
// @access  Private
router.post('/', [
  upload.single('image'),
  body('location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Location coordinates must be an array of [longitude, latitude]'),
  body('location.address')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Address must be between 1 and 200 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    const { location, metadata } = req.body;

    // Upload image to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'greentrack/scans',
          transformation: [
            { width: 1024, height: 1024, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    // Analyze image with AI
    const aiAnalysis = await analyzeWasteImage(req.file.buffer);

    // Generate disposal recommendations
    const disposalRecommendations = generateDisposalRecommendations(aiAnalysis.wasteTypes);

    // Create waste scan record
    const wasteScan = new WasteScan({
      userId: req.user.id,
      imageUrl: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
      wasteTypes: aiAnalysis.wasteTypes,
      primaryWasteType: aiAnalysis.primaryWasteType,
      overallConfidence: aiAnalysis.overallConfidence,
      location: {
        coordinates: location.coordinates,
        address: location.address,
        area: location.area,
        city: location.city,
        state: location.state
      },
      aiAnalysis: aiAnalysis.aiAnalysis,
      disposalRecommendations,
      metadata: metadata || {}
    });

    await wasteScan.save();

    // Update user statistics
    const user = await User.findById(req.user.id);
    const pointsResult = user.addEcoPoints(wasteScan.pointsEarned);
    user.totalScans += 1;
    user.updateStreak();
    await user.save();

    // Update challenge contributions
    const activeChallenges = await Challenge.find({
      status: 'active',
      'participants.userId': req.user.id,
      startDate: { $lte: new Date() },
      endDate: { $gt: new Date() }
    });

    const challengeUpdates = [];
    for (const challenge of activeChallenges) {
      try {
        let contributionAmount = 0;
        
        switch (challenge.targetMetric) {
          case 'scans':
            contributionAmount = 1;
            break;
          case 'points':
            contributionAmount = wasteScan.pointsEarned;
            break;
          case 'weight':
            // Estimate weight based on waste type (would be better with actual weight)
            contributionAmount = 0.5; // kg
            break;
        }

        if (contributionAmount > 0) {
          await challenge.updateContribution(req.user.id, contributionAmount);
          challengeUpdates.push({
            challengeId: challenge._id,
            pointsContributed: contributionAmount
          });
        }
      } catch (error) {
        console.error(`Error updating challenge ${challenge._id}:`, error);
      }
    }

    // Update scan with challenge contributions
    wasteScan.challengeContributions = challengeUpdates;
    await wasteScan.save();

    // Populate user data for response
    await wasteScan.populate('userId', 'name avatar level');

    // Emit real-time update via Socket.IO
    const io = req.app.get('io');
    io.to(`user-${req.user.id}`).emit('scanCompleted', {
      scan: wasteScan,
      pointsEarned: wasteScan.pointsEarned,
      levelUp: pointsResult.levelUp,
      newLevel: pointsResult.newLevel,
      challengeUpdates
    });

    res.status(201).json({
      success: true,
      message: 'Waste scan completed successfully',
      data: {
        scan: wasteScan,
        pointsEarned: wasteScan.pointsEarned,
        totalPoints: user.ecoPoints,
        levelUp: pointsResult.levelUp,
        newLevel: pointsResult.newLevel,
        challengeUpdates
      }
    });

  } catch (error) {
    console.error('Scan creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during scan processing'
    });
  }
});

// @route   GET /api/scans
// @desc    Get user's scans with pagination
// @access  Private
router.get('/', [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('wasteType')
    .optional()
    .isIn(['plastic', 'organic', 'paper', 'metal', 'glass', 'ewaste', 'hazardous', 'textile'])
    .withMessage('Invalid waste type'),
  query('verified')
    .optional()
    .isBoolean()
    .withMessage('Verified must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build query
    const query = { userId: req.user.id };
    
    if (req.query.wasteType) {
      query.primaryWasteType = req.query.wasteType;
    }
    
    if (req.query.verified !== undefined) {
      query.verified = req.query.verified === 'true';
    }

    // Get scans with pagination
    const scans = await WasteScan.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name avatar')
      .populate('verifiedBy', 'name avatar');

    // Get total count for pagination
    const total = await WasteScan.countDocuments(query);

    res.json({
      success: true,
      data: {
        scans,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get scans error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching scans'
    });
  }
});

// @route   GET /api/scans/statistics
// @desc    Get user's scan statistics
// @access  Private
router.get('/statistics', [
  query('timeframe')
    .optional()
    .isIn(['7d', '30d', '90d', 'all'])
    .withMessage('Invalid timeframe')
], async (req, res) => {
  try {
    const timeframe = req.query.timeframe || '30d';
    
    const statistics = await WasteScan.getStatistics(req.user.id, timeframe);
    
    res.json({
      success: true,
      data: {
        statistics: statistics[0] || {
          totalScans: 0,
          totalPoints: 0,
          averageConfidence: 0,
          verificationRate: 0,
          wasteTypeBreakdown: []
        },
        timeframe
      }
    });

  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

// @route   GET /api/scans/:id
// @desc    Get specific scan details
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const scan = await WasteScan.findOne({
      _id: req.params.id,
      userId: req.user.id
    })
    .populate('userId', 'name avatar level')
    .populate('verifiedBy', 'name avatar role');

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan not found'
      });
    }

    res.json({
      success: true,
      data: { scan }
    });

  } catch (error) {
    console.error('Get scan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching scan'
    });
  }
});

// @route   PUT /api/scans/:id/report
// @desc    Report an issue with a scan
// @access  Private
router.put('/:id/report', [
  body('reason')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Reason must be between 10 and 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { reason } = req.body;

    const scan = await WasteScan.findById(req.params.id);
    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan not found'
      });
    }

    // Update report information
    scan.reportedIssue = {
      reported: true,
      reason,
      reportedBy: req.user.id,
      reportedAt: new Date(),
      resolved: false
    };

    await scan.save();

    res.json({
      success: true,
      message: 'Issue reported successfully',
      data: { scan }
    });

  } catch (error) {
    console.error('Report scan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while reporting scan'
    });
  }
});

// @route   DELETE /api/scans/:id
// @desc    Delete a scan (only if not verified)
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const scan = await WasteScan.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan not found'
      });
    }

    if (scan.verified) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete verified scans'
      });
    }

    // Delete image from Cloudinary
    if (scan.imagePublicId) {
      await cloudinary.uploader.destroy(scan.imagePublicId);
    }

    // Remove points from user
    const user = await User.findById(req.user.id);
    user.ecoPoints = Math.max(0, user.ecoPoints - scan.pointsEarned);
    user.totalScans = Math.max(0, user.totalScans - 1);
    await user.save();

    await scan.deleteOne();

    res.json({
      success: true,
      message: 'Scan deleted successfully'
    });

  } catch (error) {
    console.error('Delete scan error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting scan'
    });
  }
});

module.exports = router;