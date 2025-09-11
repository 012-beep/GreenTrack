import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  DollarSign, 
  Calendar,
  FileText,
  Camera,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  Download
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Penalty } from '../types';

const samplePenalties: Penalty[] = [
  {
    id: 'p1',
    userId: '1',
    reason: 'Improper waste segregation - mixing organic and plastic waste',
    amount: 500,
    status: 'pending',
    issuedDate: '2024-12-20',
    dueDate: '2024-12-27',
    evidence: ['photo1.jpg', 'photo2.jpg'],
    issuedBy: 'Green Champion - Priya Sharma'
  },
  {
    id: 'p2',
    userId: '1',
    reason: 'Littering in public area',
    amount: 200,
    status: 'paid',
    issuedDate: '2024-12-15',
    dueDate: '2024-12-22',
    evidence: ['photo3.jpg'],
    issuedBy: 'ULB Officer - Rajesh Kumar'
  },
  {
    id: 'p3',
    userId: '1',
    reason: 'Illegal dumping of construction waste',
    amount: 2000,
    status: 'disputed',
    issuedDate: '2024-12-18',
    dueDate: '2024-12-25',
    evidence: ['photo4.jpg', 'photo5.jpg'],
    issuedBy: 'Municipal Inspector - Anita Singh'
  }
];

export default function Penalties() {
  const [penalties] = useState<Penalty[]>(samplePenalties);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  const filteredPenalties = penalties.filter(penalty => {
    const matchesStatus = statusFilter === 'all' || penalty.status === statusFilter;
    const matchesSearch = penalty.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      penalty.issuedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPending = penalties.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = penalties.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalDisputed = penalties.filter(p => p.status === 'disputed').reduce((sum, p) => sum + p.amount, 0);

  const handlePayPenalty = (penaltyId: string) => {
    console.log('Processing payment for penalty:', penaltyId);
    // In real app, integrate with payment gateway
  };

  const handleDisputePenalty = (penaltyId: string) => {
    console.log('Filing dispute for penalty:', penaltyId);
    // In real app, create dispute case
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Penalty Management</h1>
        <p className="text-gray-600">
          View and manage your waste management penalties
        </p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-xs text-red-600 font-medium bg-red-100 px-2 py-1 rounded-full">
              {penalties.filter(p => p.status === 'pending').length} pending
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">₹{totalPending}</h3>
          <p className="text-sm text-gray-600">Pending Penalties</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
              {penalties.filter(p => p.status === 'paid').length} paid
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">₹{totalPaid}</h3>
          <p className="text-sm text-gray-600">Paid Penalties</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-xs text-yellow-600 font-medium bg-yellow-100 px-2 py-1 rounded-full">
              {penalties.filter(p => p.status === 'disputed').length} disputed
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">₹{totalDisputed}</h3>
          <p className="text-sm text-gray-600">Disputed Penalties</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search penalties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="disputed">Disputed</option>
          </select>
        </div>
      </motion.div>

      {/* Penalties List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {filteredPenalties.map((penalty, index) => (
          <motion.div
            key={penalty.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Penalty #{penalty.id.toUpperCase()}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    penalty.status === 'pending' ? 'bg-red-100 text-red-800' :
                    penalty.status === 'paid' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {penalty.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{penalty.reason}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Issued: {new Date(penalty.issuedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Due: {new Date(penalty.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileText className="w-4 h-4" />
                    <span>By: {penalty.issuedBy}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Camera className="w-4 h-4" />
                    <span>{penalty.evidence.length} evidence files</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600 mb-1">₹{penalty.amount}</div>
                <p className="text-sm text-gray-500">Penalty Amount</p>
              </div>
            </div>

            {penalty.status === 'pending' && (
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePayPenalty(penalty.id)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Pay Now</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDisputePenalty(penalty.id)}
                  className="flex-1 border border-yellow-600 text-yellow-600 py-3 rounded-lg font-medium hover:bg-yellow-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Dispute</span>
                </motion.button>
              </div>
            )}

            {penalty.status === 'paid' && (
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-medium">Penalty paid successfully</span>
                </div>
              </div>
            )}

            {penalty.status === 'disputed' && (
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <span className="text-yellow-800 font-medium">Dispute under review</span>
                  </div>
                  <button className="text-yellow-600 hover:text-yellow-700 text-sm font-medium">
                    View Status
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Payment Gateway Integration (Mock) */}
      {filteredPenalties.some(p => p.status === 'pending') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 rounded-xl p-6 border border-blue-200"
        >
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-2">Quick Payment Options</h3>
              <p className="text-blue-800 mb-4">
                Pay all pending penalties at once with our secure payment gateway
              </p>
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay ₹{totalPending}</span>
                </motion.button>
                <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  Payment History
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}