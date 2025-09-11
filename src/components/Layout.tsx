import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Camera, 
  BookOpen,
  Award, 
  Users, 
  User,
  Crown,
  MapPin,
  AlertTriangle,
  BarChart3,
  Menu,
  X,
  Globe
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
  };

  const navigation = [
    { name: t('dashboard'), href: '/', icon: Home },
    { name: t('scanner'), href: '/scanner', icon: Camera },
    { name: t('training'), href: '/training', icon: BookOpen },
    { name: t('rewards'), href: '/rewards', icon: Award },
    { name: t('community'), href: '/community', icon: Users },
    { name: t('facilities'), href: '/facilities', icon: MapPin },
  ];

  // Add role-specific navigation
  if (user?.role === 'green_champion' || user?.role === 'ulb_admin') {
    navigation.push({ name: 'Green Champions', href: '/green-champions', icon: Crown });
  }

  if (user?.role === 'citizen' || user?.role === 'waste_worker') {
    navigation.push({ name: 'Penalties', href: '/penalties', icon: AlertTriangle });
  }

  navigation.push({ name: t('profile'), href: '/profile', icon: User });

  if (user?.role === 'admin') {
    navigation.push({ name: t('admin'), href: '/admin', icon: BarChart3 });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className={`bg-white shadow-sm border-b border-green-100 transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              {/* Desktop Sidebar Toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600" />
                )}
              </button>
              
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GT</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">GreenTrack</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-800 text-sm font-medium">{user?.ecoPoints} {t('ecoPoints')}</span>
              </div>
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Globe className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {i18n.language === 'en' ? 'हिं' : 'EN'}
                </span>
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-xs">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">Level {user?.level}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
      }`}>
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-50">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          {navigation.slice(0, 5).map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex flex-col items-center px-2 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`
              }
            >
              <item.icon className="w-4 h-4 mb-1" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col z-40 transition-transform duration-300 ${
        sidebarOpen ? 'lg:translate-x-0' : 'lg:-translate-x-full'
      }`}>
        <div className="flex min-h-0 flex-1 flex-col bg-white shadow-lg">
          <div className="flex items-center space-x-3 px-6 py-4 border-b border-gray-200">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GT</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">GreenTrack</h1>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <nav className="mt-8 flex-1 space-y-1 px-4">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      {/* Sidebar Overlay for Mobile (if needed in future) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}