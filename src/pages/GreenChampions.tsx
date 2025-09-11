import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Users, 
  TrendingUp, 
  Award,
  MapPin,
  Calendar,
  Target,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Flag
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

const areaStats = [
  {
    area: 'Connaught Place',
    compliance: 92,
    totalHouseholds: 450,
    compliantHouseholds: 414,
    champion: 'Priya Sharma',
    trend: '+5%'
  },
  {
    area: 'Khan Market',
    compliance: 87,
    totalHouseholds: 320,
    compliantHouseholds: 278,
    champion: 'Rajesh Kumar',
    trend: '+3%'
  },
  {
    area: 'Lajpat Nagar',
    compliance: 78,
    totalHouseholds: 680,
    compliantHouseholds: 530,
    champion: 'Anita Singh',
    trend: '-2%'
  },
  {
    area: 'Karol Bagh',
    compliance: 95,
    totalHouseholds: 520,
    compliantHouseholds: 494,
    champion: 'Vikram Gupta',
    trend: '+8%'
  }
];

const violationReports = [
  {
    id: '1',
    area: 'Lajpat Nagar',
    type: 'Mixed Waste',
    severity: 'medium',
    reportedBy: 'Green Champion',
    timestamp: '2 hours ago',
    status: 'pending',
    description: 'Household mixing organic and plastic waste'
  },
  {
    id: '2',
    area: 'Khan Market',
    type: 'Illegal Dumping',
    severity: 'high',
    reportedBy: 'Citizen',
    timestamp: '5 hours ago',
    status: 'resolved',
    description: 'Construction waste dumped on roadside'
  },
  {
    id: '3',
    area: 'Connaught Place',
    type: 'Overflowing Bin',
    severity: 'low',
    reportedBy: 'Waste Worker',
    timestamp: '1 day ago',
    status: 'in_progress',
    description: 'Public dustbin overflowing, needs immediate attention'
  }
];

export default function GreenChampions() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedArea, setSelectedArea] = useState('all');
  const { user } = useAuth();
  const { challenges } = useData();

  const isGreenChampion = user?.role === 'green_champion';

  const tabs = [
    { id: 'overview', label: 'Area Overview' },
    { id: 'compliance', label: 'Compliance Tracking' },
    { id: 'reports', label: 'Violation Reports' },
    { id: 'leaderboard', label: 'Area Leaderboard' }
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Green Champions Dashboard</h1>
        <p className="text-gray-600">
          Monitor and improve waste segregation compliance in your area
        </p>
      </motion.div>

      {/* Champion Status */}
      {isGreenChampion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">Green Champion</h2>
              <p className="text-yellow-100 mb-2">
                You're responsible for monitoring {user?.location?.area || 'your area'}
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>450 households</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span>92% compliance</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

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
              {tab.label}
            </button>
          ))}
        </nav>
      </motion.div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {areaStats.map((area, index) => (
            <motion.div
              key={area.area}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{area.area}</h3>
                  <p className="text-gray-600">Champion: {area.champion}</p>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    area.compliance >= 90 ? 'text-green-600' :
                    area.compliance >= 75 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {area.compliance}%
                  </div>
                  <p className="text-sm text-gray-500">Compliance</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      area.compliance >= 90 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                      area.compliance >= 75 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                      'bg-gradient-to-r from-red-400 to-red-600'
                    }`}
                    style={{ width: `${area.compliance}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {area.compliantHouseholds}/{area.totalHouseholds} households
                  </span>
                  <span className={`font-medium ${
                    area.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {area.trend}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {activeTab === 'compliance' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Compliance Monitoring</h3>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Areas</option>
              {areaStats.map(area => (
                <option key={area.area} value={area.area}>{area.area}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">87%</div>
              <div className="text-sm text-gray-600">Overall Compliance</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1,970</div>
              <div className="text-sm text-gray-600">Total Households</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">12</div>
              <div className="text-sm text-gray-600">Active Violations</div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Recent Compliance Checks:</h4>
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Household #{item}23</p>
                    <p className="text-sm text-gray-600">Proper segregation verified</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-green-600">Compliant</span>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'reports' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {violationReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    report.severity === 'high' ? 'bg-red-100' :
                    report.severity === 'medium' ? 'bg-yellow-100' :
                    'bg-blue-100'
                  }`}>
                    <AlertTriangle className={`w-6 h-6 ${
                      report.severity === 'high' ? 'text-red-600' :
                      report.severity === 'medium' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{report.type}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        report.severity === 'high' ? 'bg-red-100 text-red-800' :
                        report.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {report.severity}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{report.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{report.area}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Flag className="w-4 h-4" />
                        <span>By {report.reportedBy}</span>
                      </div>
                      <span>{report.timestamp}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  report.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {report.status.replace('_', ' ')}
                </span>
              </div>

              {isGreenChampion && report.status === 'pending' && (
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Investigate
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 border border-red-600 text-red-600 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors"
                  >
                    Issue Penalty
                  </motion.button>
                </div>
              )}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Area Compliance Leaderboard</h3>
          
          <div className="space-y-4">
            {areaStats
              .sort((a, b) => b.compliance - a.compliance)
              .map((area, index) => (
                <motion.div
                  key={area.area}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200' :
                    index === 1 ? 'bg-gray-50 border border-gray-200' :
                    index === 2 ? 'bg-amber-50 border border-amber-200' :
                    'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                      index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                      index === 2 ? 'bg-gradient-to-r from-amber-600 to-yellow-700' :
                      'bg-gradient-to-r from-green-400 to-emerald-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{area.area}</p>
                      <p className="text-sm text-gray-600">Champion: {area.champion}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-xl font-bold ${
                      area.compliance >= 90 ? 'text-green-600' :
                      area.compliance >= 75 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {area.compliance}%
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <TrendingUp className={`w-4 h-4 ${
                        area.trend.startsWith('+') ? 'text-green-500' : 'text-red-500 rotate-180'
                      }`} />
                      <span className={area.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                        {area.trend}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}