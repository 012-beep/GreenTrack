import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trash2, 
  TrendingUp, 
  Target, 
  Leaf,
  Award,
  Users,
  Camera,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const { scans, challenges } = useData();

  const todayScans = scans.filter(scan => {
    const today = new Date().toDateString();
    const scanDate = new Date(scan.timestamp).toDateString();
    return today === scanDate;
  });

  const wasteStats = scans.reduce((acc, scan) => {
    acc[scan.wasteType] = (acc[scan.wasteType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const activeChallenge = challenges.find(c => c.type === 'individual' && c.currentAmount < c.targetAmount);

  const statCards = [
    {
      title: 'Total Scans',
      value: user?.totalScans || 0,
      change: '+12%',
      icon: Camera,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Eco Points',
      value: user?.ecoPoints || 0,
      change: '+5%',
      icon: Leaf,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Today\'s Scans',
      value: todayScans.length,
      change: 'New',
      icon: Trash2,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Current Level',
      value: user?.level || 1,
      change: 'Rising',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {user?.name}! 🌱
            </h2>
            <p className="text-green-100 mb-4">
              You're making a difference with every scan. Keep up the great work!
            </p>
            <Link
              to="/scanner"
              className="inline-flex items-center bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors"
            >
              <Camera className="w-4 h-4 mr-2" />
              Start Scanning
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Active Challenge */}
      {activeChallenge && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Target className="w-5 h-5 mr-2 text-orange-500" />
              Active Challenge
            </h3>
            <Link
              to="/community"
              className="text-green-600 hover:text-green-700 font-medium text-sm"
            >
              View All
            </Link>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">{activeChallenge.title}</h4>
            <p className="text-sm text-gray-600 mb-3">{activeChallenge.description}</p>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progress: {activeChallenge.currentAmount}/{activeChallenge.targetAmount}
              </span>
              <span className="text-sm text-green-600 font-medium">
                +{activeChallenge.reward} points
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${(activeChallenge.currentAmount / activeChallenge.targetAmount) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <Link
          to="/scanner"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:scale-105 group"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Scan Waste</h3>
          <p className="text-sm text-gray-600">Identify and categorize waste items</p>
        </Link>

        <Link
          to="/rewards"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:scale-105 group"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">My Rewards</h3>
          <p className="text-sm text-gray-600">View badges and achievements</p>
        </Link>

        <Link
          to="/community"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:scale-105 group col-span-2 lg:col-span-1"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
          <p className="text-sm text-gray-600">Join challenges and compete</p>
        </Link>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Scans</h3>
        
        {scans.length === 0 ? (
          <div className="text-center py-8">
            <Trash2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No scans yet</p>
            <Link
              to="/scanner"
              className="inline-flex items-center text-green-600 font-medium hover:text-green-700"
            >
              Start your first scan
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {scans.slice(0, 5).map((scan) => (
              <div key={scan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{scan.wasteType}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(scan.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">+{scan.pointsEarned} points</p>
                  <p className="text-xs text-gray-500">{Math.round(scan.confidence * 100)}% confidence</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}