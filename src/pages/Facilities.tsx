import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Clock,
  Star,
  Truck,
  ShoppingCart,
  Filter,
  Search,
  Route,
  Package,
  CreditCard
} from 'lucide-react';
import { useFacilities } from '../contexts/FacilitiesContext';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function Facilities() {
  const [activeTab, setActiveTab] = useState('facilities');
  const [selectedWasteType, setSelectedWasteType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState({ lat: 28.6139, lng: 77.2090 });
  const { facilities, vehicles, utilities, findNearbyFacilities, trackVehicle, purchaseUtility } = useFacilities();
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  }, []);

  const filteredFacilities = facilities.filter(facility => {
    const matchesWasteType = selectedWasteType === 'all' || 
      facility.acceptedWasteTypes.includes(selectedWasteType);
    const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesWasteType && matchesSearch;
  });

  const filteredUtilities = utilities.filter(utility =>
    utility.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const wasteTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'plastic', label: t('plastic') },
    { value: 'paper', label: t('paper') },
    { value: 'organic', label: t('organic') },
    { value: 'metal', label: t('metal') },
    { value: 'ewaste', label: t('ewaste') },
    { value: 'glass', label: t('glass') }
  ];

  const facilityTypeIcons = {
    recycling_center: '♻️',
    scrap_shop: '🔧',
    wte_plant: '⚡',
    compost_center: '🌱'
  };

  const tabs = [
    { id: 'facilities', label: t('nearbyFacilities'), count: filteredFacilities.length },
    { id: 'vehicles', label: 'Collection Vehicles', count: vehicles.length },
    { id: 'utilities', label: 'Waste Utilities', count: utilities.length }
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Waste Facilities & Services</h1>
        <p className="text-gray-600">
          Find nearby facilities, track collection vehicles, and shop for waste utilities
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search facilities or utilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          {activeTab === 'facilities' && (
            <select
              value={selectedWasteType}
              onChange={(e) => setSelectedWasteType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {wasteTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          )}
        </div>
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
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                activeTab === tab.id
                  ? 'bg-white bg-opacity-20'
                  : 'bg-gray-200'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </motion.div>

      {/* Tab Content */}
      {activeTab === 'facilities' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {filteredFacilities.map((facility, index) => (
            <motion.div
              key={facility.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-2xl">
                    {facilityTypeIcons[facility.type]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{facility.name}</h3>
                      {facility.verified && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2 capitalize">
                      {facility.type.replace('_', ' ')}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{facility.location.address}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{facility.operatingHours}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{facility.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Accepted Waste Types:</h4>
                <div className="flex flex-wrap gap-2">
                  {facility.acceptedWasteTypes.map(type => (
                    <span
                      key={type}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="border border-green-600 text-green-600 py-2 px-4 rounded-lg font-medium hover:bg-green-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {activeTab === 'vehicles' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {vehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    vehicle.status === 'active' ? 'bg-green-100' :
                    vehicle.status === 'inactive' ? 'bg-gray-100' :
                    'bg-red-100'
                  }`}>
                    <Truck className={`w-6 h-6 ${
                      vehicle.status === 'active' ? 'text-green-600' :
                      vehicle.status === 'inactive' ? 'text-gray-600' :
                      'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{vehicle.vehicleNumber}</h3>
                    <p className="text-gray-600">Driver: {vehicle.driverName}</p>
                    <p className="text-sm text-gray-500">{vehicle.route}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    vehicle.status === 'active' ? 'bg-green-100 text-green-800' :
                    vehicle.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {vehicle.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    Load: {vehicle.currentLoad}/{vehicle.capacity} kg
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(vehicle.currentLoad / vehicle.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Today's Schedule:</h4>
                {vehicle.schedule.map((schedule, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">{schedule.time}</span>
                      <span className="text-sm text-gray-600">{schedule.area}</span>
                    </div>
                    <div className="flex space-x-1">
                      {schedule.wasteType.map(type => (
                        <span key={type} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Route className="w-4 h-4" />
                <span>Track Vehicle</span>
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      )}

      {activeTab === 'utilities' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredUtilities.map((utility, index) => (
            <motion.div
              key={utility.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                <img
                  src={utility.image}
                  alt={utility.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{utility.name}</h3>
                  <p className="text-sm text-gray-600">{utility.description}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">{utility.rating}</span>
                    <span className="text-sm text-gray-500">({utility.reviews})</span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    utility.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {utility.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">₹{utility.price}</span>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => purchaseUtility(utility.id, 1)}
                    disabled={!utility.inStock}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Buy Now</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}