import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BarChart3, 
  AlertTriangle, 
  TrendingUp, 
  MapPin, 
  Calendar,
  DollarSign,
  Award,
  FileText,
  Settings,
  Download,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useTranslation } from 'react-i18next';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const { user } = useAuth();
  const { users, scans, penalties } = useData();
  const { t } = useTranslation();

  // Mock admin data
  const adminStats = {
    totalUsers: 15420,
    activeUsers: 8934,
    totalScans: 45678,
    todayScans: 234,
    totalPenalties: 1234,
    pendingPenalties: 89,
    revenue: 567890,
    wasteProcessed: 12345
  };

  const recentActivities = [
    { id: 1, type: 'scan', user: 'John Doe', action: 'Scanned plastic waste', time: '2 mins ago', location: 'Sector 15' },
    { id: 2, type: 'penalty', user: 'Jane Smith', action: 'Penalty issued for improper segregation', time: '5 mins ago', location: 'Sector 22' },
    { id: 3, type: 'training', user: 'Mike Johnson', action: 'Completed waste worker training', time: '10 mins ago', location: 'Online' },
    { id: 4, type: 'challenge', user: 'Sarah Wilson', action: 'Joined Zero Waste Week challenge', time: '15 mins ago', location: 'Sector 8' }
  ];

  const wasteStats = [
    { type: 'Plastic', count: 12450, percentage: 35, color: 'bg-blue-500' },
    { type: 'Organic', count: 8930, percentage: 25, color: 'bg-green-500' },
    { type: 'Paper', count: 7120, percentage: 20, color: 'bg-yellow-500' },
    { type: 'Metal', count: 4560, percentage: 13, color: 'bg-gray-500' },
    { type: 'E-Waste', count: 1890, percentage: 5, color: 'bg-purple-500' },
    { type: 'Glass', count: 890, percentage: 2, color: 'bg-cyan-500' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: t('userManagement'), icon: Users },
    { id: 'waste', label: t('wasteTracking'), icon: MapPin },
    { id: 'analytics', label: t('analytics'), icon: TrendingUp },
    { id: 'penalties', label: t('penaltyManagement'), icon: AlertTriangle },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage waste tracking, users, and system analytics</p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-2 shadow-sm border border-gray-100"
      >
        <nav className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center space-y-1 px-3 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-green-500 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </motion.div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Users', value: adminStats.totalUsers.toLocaleString(), icon: Users, color: 'blue' },
              { label: 'Active Users', value: adminStats.activeUsers.toLocaleString(), icon: UserCheck, color: 'green' },
              { label: 'Total Scans', value: adminStats.totalScans.toLocaleString(), icon: BarChart3, color: 'purple' },
              { label: 'Today\'s Scans', value: adminStats.todayScans.toLocaleString(), icon: TrendingUp, color: 'orange' }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${stat.color}-600`} />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Waste Distribution Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Waste Distribution</h3>
            <div className="space-y-4">
              {wasteStats.map((waste, index) => (
                <div key={waste.type} className="flex items-center space-x-4">
                  <div className="w-20 text-sm font-medium text-gray-700">{waste.type}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${waste.percentage}%` }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                      className={`h-3 rounded-full ${waste.color}`}
                    ></motion.div>
                  </div>
                  <div className="w-16 text-sm text-gray-600 text-right">
                    {waste.count.toLocaleString()}
                  </div>
                  <div className="w-12 text-sm text-gray-500 text-right">
                    {waste.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'scan' ? 'bg-blue-100' :
                    activity.type === 'penalty' ? 'bg-red-100' :
                    activity.type === 'training' ? 'bg-green-100' :
                    'bg-purple-100'
                  }`}>
                    {activity.type === 'scan' && <BarChart3 className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'penalty' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                    {activity.type === 'training' && <Award className="w-4 h-4 text-green-600" />}
                    {activity.type === 'challenge' && <Users className="w-4 h-4 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{activity.time}</p>
                    <p className="text-xs text-gray-500">{activity.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
            <div className="flex space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="all">All Roles</option>
                <option value="citizen">Citizens</option>
                <option value="worker">Waste Workers</option>
                <option value="champion">Green Champions</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Scans</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Points</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 10).map((user, index) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'champion' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'worker' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{user.totalScans}</td>
                    <td className="py-3 px-4 text-gray-900">{user.ecoPoints}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Revenue', value: `₹${adminStats.revenue.toLocaleString()}`, icon: DollarSign, color: 'green' },
              { label: 'Waste Processed', value: `${adminStats.wasteProcessed} kg`, icon: BarChart3, color: 'blue' },
              { label: 'Pending Penalties', value: adminStats.pendingPenalties.toString(), icon: AlertTriangle, color: 'red' },
              { label: 'Certificates Issued', value: '234', icon: Award, color: 'purple' }
            ].map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-10 h-10 bg-${metric.color}-100 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${metric.color}-600`} />
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <p className="text-sm text-gray-600">{metric.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Waste Trends</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Chart.js integration ready</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Activity</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Chart.js integration ready</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Other tabs content can be added here */}
      {activeTab !== 'overview' && activeTab !== 'users' && activeTab !== 'analytics' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {tabs.find(tab => tab.id === activeTab)?.label} Section
          </h3>
          <p className="text-gray-600">This section is ready for implementation.</p>
        </motion.div>
      )}
    </div>
  );
}