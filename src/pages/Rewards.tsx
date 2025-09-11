import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Trophy, 
  Star, 
  Gift,
  Target,
  Zap,
  Crown,
  Medal,
  Sparkles,
  TrendingUp,
  Calendar,
  Users
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

const badges = [
  {
    id: 'first-scan',
    name: 'First Scanner',
    description: 'Completed your first waste scan',
    icon: '🎯',
    rarity: 'common',
    points: 50,
    unlocked: true
  },
  {
    id: 'eco-warrior',
    name: 'Eco Warrior',
    description: 'Scanned 50 waste items',
    icon: '🌱',
    rarity: 'rare',
    points: 200,
    unlocked: true
  },
  {
    id: 'plastic-hero',
    name: 'Plastic Hero',
    description: 'Properly disposed 25 plastic items',
    icon: '♻️',
    rarity: 'epic',
    points: 300,
    unlocked: true
  },
  {
    id: 'green-champion',
    name: 'Green Champion',
    description: 'Reached level 10',
    icon: '🏆',
    rarity: 'legendary',
    points: 500,
    unlocked: false
  },
  {
    id: 'community-leader',
    name: 'Community Leader',
    description: 'Led 5 community challenges',
    icon: '👑',
    rarity: 'legendary',
    points: 750,
    unlocked: false
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Scanned waste for 30 consecutive days',
    icon: '🔥',
    rarity: 'epic',
    points: 400,
    unlocked: false
  }
];

const achievements = [
  {
    id: 'daily-scanner',
    name: 'Daily Scanner',
    description: 'Scan waste items daily',
    progress: 7,
    target: 30,
    reward: 100,
    type: 'daily'
  },
  {
    id: 'plastic-reducer',
    name: 'Plastic Reducer',
    description: 'Properly dispose plastic items',
    progress: 15,
    target: 25,
    reward: 150,
    type: 'category'
  },
  {
    id: 'community-contributor',
    name: 'Community Contributor',
    description: 'Participate in community challenges',
    progress: 2,
    target: 5,
    reward: 200,
    type: 'social'
  }
];

const leaderboard = [
  { rank: 1, name: 'EcoMaster2024', points: 2450, avatar: '🌟', change: 0 },
  { rank: 2, name: 'GreenGuru', points: 2380, avatar: '🌱', change: 1 },
  { rank: 3, name: 'WasteWarrior', points: 2250, avatar: '♻️', change: -1 },
  { rank: 4, name: 'PlasticHunter', points: 2100, avatar: '🎯', change: 2 },
  { rank: 5, name: 'EcoChampion', points: 1950, avatar: '🏆', change: 0 },
  { rank: 6, name: 'You', points: 1250, avatar: '👤', change: 3 }
];

const rewardTiers = [
  {
    name: 'Bronze',
    minPoints: 0,
    maxPoints: 499,
    color: 'from-amber-600 to-yellow-700',
    benefits: ['Basic eco-tips', 'Community access']
  },
  {
    name: 'Silver',
    minPoints: 500,
    maxPoints: 1499,
    color: 'from-gray-400 to-gray-600',
    benefits: ['Priority support', 'Exclusive challenges', 'Monthly rewards']
  },
  {
    name: 'Gold',
    minPoints: 1500,
    maxPoints: 2999,
    color: 'from-yellow-400 to-yellow-600',
    benefits: ['Premium features', 'VIP community', 'Special badges']
  },
  {
    name: 'Platinum',
    minPoints: 3000,
    maxPoints: Infinity,
    color: 'from-purple-400 to-purple-600',
    benefits: ['All features', 'Leadership board', 'Exclusive events']
  }
];

export default function Rewards() {
  const [activeTab, setActiveTab] = useState('badges');
  const { user } = useAuth();
  const { scans } = useData();

  const userPoints = user?.ecoPoints || 0;
  const currentTier = rewardTiers.find(tier => 
    userPoints >= tier.minPoints && userPoints <= tier.maxPoints
  ) || rewardTiers[0];

  const nextTier = rewardTiers.find(tier => tier.minPoints > userPoints);
  const progressToNext = nextTier ? 
    ((userPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100 : 100;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const tabs = [
    { id: 'badges', label: 'Badges', count: badges.filter(b => b.unlocked).length },
    { id: 'achievements', label: 'Achievements', count: achievements.length },
    { id: 'leaderboard', label: 'Leaderboard', count: 0 },
    { id: 'rewards', label: 'Rewards', count: 0 }
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rewards & Achievements</h1>
        <p className="text-gray-600">
          Track your progress and earn rewards for making a difference
        </p>
      </motion.div>

      {/* Current Tier Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-r ${currentTier.color} rounded-full flex items-center justify-center`}>
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{currentTier.name} Tier</h3>
              <p className="text-gray-600">{userPoints} Eco Points</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1 text-green-600 mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Level {user?.level}</span>
            </div>
            <p className="text-xs text-gray-500">
              {badges.filter(b => b.unlocked).length} badges earned
            </p>
          </div>
        </div>

        {nextTier && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">
                Progress to {nextTier.name}
              </span>
              <span className="text-green-600 font-medium">
                {userPoints}/{nextTier.minPoints} points
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`bg-gradient-to-r ${currentTier.color} h-3 rounded-full transition-all duration-500 relative overflow-hidden`}
                style={{ width: `${Math.min(progressToNext, 100)}%` }}
              >
                <div className="absolute inset-0 bg-white bg-opacity-20 animate-pulse"></div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {nextTier.minPoints - userPoints} more points to reach {nextTier.name} tier
            </p>
          </div>
        )}
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-2 shadow-sm border border-gray-100"
      >
        <nav className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-green-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.id
                    ? 'bg-white bg-opacity-20'
                    : 'bg-gray-200'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </motion.div>

      {/* Tab Content */}
      {activeTab === 'badges' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {badges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all ${
                badge.unlocked ? 'opacity-100' : 'opacity-60'
              }`}
            >
              <div className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${getRarityColor(badge.rarity)} rounded-full flex items-center justify-center mx-auto mb-4 text-2xl ${
                  badge.unlocked ? 'badge-bounce' : ''
                }`}>
                  {badge.unlocked ? badge.icon : '🔒'}
                </div>
                <h3 className={`font-bold mb-2 ${badge.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                  {badge.name}
                </h3>
                <p className={`text-sm mb-3 ${badge.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                  {badge.description}
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <Star className={`w-4 h-4 ${badge.unlocked ? 'text-yellow-500' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${badge.unlocked ? 'text-green-600' : 'text-gray-400'}`}>
                    {badge.points} points
                  </span>
                </div>
                <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 capitalize ${
                  badge.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                  badge.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                  badge.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {badge.rarity}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {activeTab === 'achievements' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{achievement.name}</h3>
                    <p className="text-gray-600">{achievement.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-green-600 mb-1">
                    <Gift className="w-4 h-4" />
                    <span className="text-sm font-medium">+{achievement.reward}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    achievement.type === 'daily' ? 'bg-blue-100 text-blue-700' :
                    achievement.type === 'category' ? 'bg-green-100 text-green-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {achievement.type}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">
                    Progress: {achievement.progress}/{achievement.target}
                  </span>
                  <span className="text-green-600 font-medium">
                    {Math.round((achievement.progress / achievement.target) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {activeTab === 'leaderboard' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Global Leaderboard</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>This Week</span>
            </div>
          </div>

          <div className="space-y-3">
            {leaderboard.map((player, index) => (
              <motion.div
                key={player.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                  player.name === 'You' 
                    ? 'bg-green-50 border-2 border-green-200' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    player.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                    player.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                    player.rank === 3 ? 'bg-gradient-to-r from-amber-600 to-yellow-700' :
                    'bg-gradient-to-r from-green-400 to-emerald-500'
                  }`}>
                    {player.rank <= 3 ? (
                      player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : '🥉'
                    ) : (
                      player.rank
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold ${player.name === 'You' ? 'text-green-800' : 'text-gray-900'}`}>
                      {player.name}
                    </p>
                    <p className="text-sm text-gray-600">{player.points.toLocaleString()} points</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {player.change !== 0 && (
                    <div className={`flex items-center space-x-1 ${
                      player.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className={`w-4 h-4 ${player.change < 0 ? 'rotate-180' : ''}`} />
                      <span className="text-sm font-medium">{Math.abs(player.change)}</span>
                    </div>
                  )}
                  <span className="text-2xl">{player.avatar}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'rewards' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Tier Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rewardTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all ${
                  tier.name === currentTier.name 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-100 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${tier.color} rounded-lg flex items-center justify-center`}>
                      <Medal className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{tier.name}</h3>
                      <p className="text-sm text-gray-600">
                        {tier.minPoints === 0 ? '0' : tier.minPoints.toLocaleString()}
                        {tier.maxPoints === Infinity ? '+' : ` - ${tier.maxPoints.toLocaleString()}`} points
                      </p>
                    </div>
                  </div>
                  {tier.name === currentTier.name && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                      Current
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 mb-2">Benefits:</h4>
                  {tier.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Reward Redemption (Mock) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reward Redemption</h3>
            <div className="text-center py-8">
              <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon!</h4>
              <p className="text-gray-600 mb-6">
                Redeem your eco-points for exciting rewards from our partner stores
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                Notify Me
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}