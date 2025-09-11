import React, { createContext, useContext, useState } from 'react';

import { WasteScan, Challenge } from '../types';

interface DataContextType {
  scans: WasteScan[];
  challenges: Challenge[];
  addScan: (scan: Omit<WasteScan, 'id' | 'timestamp'>) => void;
  updateChallenge: (challengeId: string, progress: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [scans, setScans] = useState<WasteScan[]>([
    {
      id: '1',
      userId: '1',
      wasteType: 'Plastic',
      confidence: 0.95,
      timestamp: '2024-12-20T10:30:00Z',
      pointsEarned: 10,
      location: {
        lat: 28.6139,
        lng: 77.2090,
        address: 'Connaught Place, New Delhi'
      },
      geoTagged: true,
      verified: true
    },
    {
      id: '2',
      userId: '1',
      wasteType: 'Paper',
      confidence: 0.88,
      timestamp: '2024-12-20T14:15:00Z',
      pointsEarned: 8,
      location: {
        lat: 28.5355,
        lng: 77.3910,
        address: 'Noida, Uttar Pradesh'
      },
      geoTagged: true,
      verified: false
    }
  ]);

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Plastic Free Week',
      description: 'Scan and properly dispose of 20 plastic items',
      targetAmount: 20,
      currentAmount: 12,
      reward: 100,
      endDate: '2024-12-27',
      type: 'individual',
      category: 'segregation',
      participants: ['1']
    },
    {
      id: '2',
      title: 'Community Clean Drive',
      description: 'Our community goal: 500 total scans this month',
      targetAmount: 500,
      currentAmount: 347,
      reward: 250,
      endDate: '2024-12-31',
      type: 'community',
      category: 'collection',
      participants: ['1', '2', '3']
    },
    {
      id: '3',
      title: 'E-Waste Hero',
      description: 'Properly dispose of 5 electronic items',
      targetAmount: 5,
      currentAmount: 2,
      reward: 150,
      endDate: '2024-12-30',
      type: 'individual',
      category: 'recycling',
      participants: ['1']
    }
  ]);

  const addScan = (scanData: Omit<WasteScan, 'id' | 'timestamp'>) => {
    const newScan: WasteScan = {
      ...scanData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setScans(prev => [newScan, ...prev]);
  };

  const updateChallenge = (challengeId: string, progress: number) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, currentAmount: Math.min(challenge.targetAmount, challenge.currentAmount + progress) }
        : challenge
    ));
  };

  return (
    <DataContext.Provider value={{ scans, challenges, addScan, updateChallenge }}>
      {children}
    </DataContext.Provider>
  );
}