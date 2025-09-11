import React, { createContext, useContext, useState, useEffect } from 'react';

import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('greentrack_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in real app, this would call Firebase Auth
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      role: email.includes('admin') ? 'ulb_admin' : 
            email.includes('champion') ? 'green_champion' :
            email.includes('worker') ? 'waste_worker' : 'citizen',
      ecoPoints: 1250,
      level: 5,
      badges: ['first-scan', 'eco-warrior', 'plastic-hero'],
      joinedDate: '2024-01-15',
      totalScans: 47,
      location: {
        lat: 28.6139,
        lng: 77.2090,
        address: 'Connaught Place, New Delhi',
        area: 'Central Delhi',
        city: 'New Delhi'
      },
      trainingProgress: [],
      certificates: [],
      penaltyLog: []
    };
    
    setUser(mockUser);
    localStorage.setItem('greentrack_user', JSON.stringify(mockUser));
  };

  const signup = async (email: string, password: string, name: string) => {
    // Mock signup
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: 'citizen',
      ecoPoints: 0,
      level: 1,
      badges: [],
      joinedDate: new Date().toISOString().split('T')[0],
      totalScans: 0,
      location: {
        lat: 28.6139,
        lng: 77.2090,
        address: 'New Delhi',
        area: 'Central Delhi',
        city: 'New Delhi'
      },
      trainingProgress: [],
      certificates: [],
      penaltyLog: []
    };
    
    setUser(mockUser);
    localStorage.setItem('greentrack_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('greentrack_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('greentrack_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}