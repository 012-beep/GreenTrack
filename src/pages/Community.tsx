import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Trophy, 
  Target, 
  Calendar,
  MapPin,
  Award,
  TrendingUp,
  Clock,
  ChevronRight,
  Star
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

const communityStats = [
  { label: 'Total Members', value: '2,847', change: '+127', icon: Users },
  { label: 'Items Scanned Today', value: '1,234', change: '+89', icon: Target },
  { label: 'CO₂ Saved (kg)', value: '5,678', change: '+234', icon: TrendingUp },
  { label: 'Active Challenges', value: '12', change: '+2', icon: Trophy }
];

const topCommunities = [
  { 
    name: 'Green Delhi Initiative', 
    members: 456, 
    scans: 12430, 
    avatar: '🌿',
    location: 'Delhi, India'
  },
  { 
    name: 'Mumbai Waste Warriors', 
    members: 389, 
    scans: 11250, 
    avatar: '♻️',
    location: 'Mumbai, India'
  },
  { 
    name: 'Bangalore Clean Tech', 
    members: 342, 
    scans: 9890, 
    avatar: '🌱',
    location: 'Bangalore, India'
  },
  { 
    name: 'Chennai Eco Heroes', 
    members: 278, 
    scans: 8760, 
    avatar: '🌍',
    location: 'Chennai, India'
  }
];

export default function Community() {
  const [activeTab, setActiveTab] = useState('challenges');
  const { challenges, updateChallenge } = useData();
  const { user, updateUser } = useAuth();

  const joinChallenge = (challengeId: string) => {
    // Mock joining a challenge
    console.log('Joining challenge:', challengeId);
  };

  const tabs = [
    { id: 'challenges', label: 'Challenges', count: challenges.length },
    { id: 'communities', label: 'Communities', count: topCommunities.length },
    { id: 'leaderboard', label: 'Leaderboard', count: 0 }
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Hub</h1>
        <p className="text-gray-600">
          Join challenges, connect with others, and make an impact together
        </p>
      </motion.div>

      {/* Community Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {communityStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
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
      {activeTab === 'challenges' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{challenge.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      challenge.type === 'community'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {challenge.type === 'community' ? 'Community' : 'Individual'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{challenge.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Ends {new Date(challenge.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4" />
                      <span>{challenge.reward} points</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Progress: {challenge.currentAmount}/{challenge.targetAmount}
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    {Math.round((challenge.currentAmount / challenge.targetAmount) * 100)}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                    style={{
                      width: `${Math.min((challenge.currentAmount / challenge.targetAmount) * 100, 100)}%`
                    }}
                  >
                    <div className="absolute inset-0 bg-white bg-opacity-20 animate-pulse"></div>
                  </div>
                </div>

                {challenge.currentAmount < challenge.targetAmount && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => joinChallenge(challenge.id)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Target className="w-4 h-4" />
                    <span>Join Challenge</span>
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {activeTab === 'communities' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {topCommunities.map((community, index) => (
            <motion.div
              key={community.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-2xl">
                    {community.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {community.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{community.members} members</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="w-4 h-4" />
                        <span>{community.scans.toLocaleString()} scans</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>{community.location}</span>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  Join
                </motion.button>
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
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Leaderboard</h3>
            <p className="text-gray-600 mb-6">
              See how your community ranks against others worldwide
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              View Full Leaderboard
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}