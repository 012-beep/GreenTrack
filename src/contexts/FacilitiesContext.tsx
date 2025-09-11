import React, { createContext, useContext, useState } from 'react';
import { WasteFacility, CollectionVehicle, WasteUtility } from '../types';

interface FacilitiesContextType {
  facilities: WasteFacility[];
  vehicles: CollectionVehicle[];
  utilities: WasteUtility[];
  findNearbyFacilities: (lat: number, lng: number, wasteType?: string) => WasteFacility[];
  trackVehicle: (vehicleId: string) => CollectionVehicle | undefined;
  purchaseUtility: (utilityId: string, quantity: number) => void;
}

const FacilitiesContext = createContext<FacilitiesContextType | undefined>(undefined);

export function useFacilities() {
  const context = useContext(FacilitiesContext);
  if (context === undefined) {
    throw new Error('useFacilities must be used within a FacilitiesProvider');
  }
  return context;
}

const sampleFacilities: WasteFacility[] = [
  {
    id: '1',
    name: 'Delhi Recycling Hub',
    type: 'recycling_center',
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Connaught Place, New Delhi'
    },
    acceptedWasteTypes: ['plastic', 'paper', 'metal', 'glass'],
    operatingHours: '9:00 AM - 6:00 PM',
    contact: '+91-9876543210',
    rating: 4.5,
    verified: true
  },
  {
    id: '2',
    name: 'Green Energy Plant',
    type: 'wte_plant',
    location: {
      lat: 28.5355,
      lng: 77.3910,
      address: 'Noida, Uttar Pradesh'
    },
    acceptedWasteTypes: ['organic', 'paper'],
    operatingHours: '24/7',
    contact: '+91-9876543211',
    rating: 4.2,
    verified: true
  },
  {
    id: '3',
    name: 'Tech Scrap Solutions',
    type: 'scrap_shop',
    location: {
      lat: 28.4595,
      lng: 77.0266,
      address: 'Gurgaon, Haryana'
    },
    acceptedWasteTypes: ['ewaste', 'metal'],
    operatingHours: '10:00 AM - 8:00 PM',
    contact: '+91-9876543212',
    rating: 4.0,
    verified: true
  }
];

const sampleVehicles: CollectionVehicle[] = [
  {
    id: 'v1',
    vehicleNumber: 'DL-01-AB-1234',
    driverName: 'Rajesh Kumar',
    route: 'Central Delhi Route',
    currentLocation: {
      lat: 28.6139,
      lng: 77.2090
    },
    status: 'active',
    capacity: 1000,
    currentLoad: 650,
    schedule: [
      {
        area: 'Connaught Place',
        time: '09:00 AM',
        wasteType: ['organic', 'plastic'],
        estimatedDuration: 30
      },
      {
        area: 'Khan Market',
        time: '10:00 AM',
        wasteType: ['paper', 'metal'],
        estimatedDuration: 45
      }
    ]
  }
];

const sampleUtilities: WasteUtility[] = [
  {
    id: 'u1',
    name: 'Smart Segregation Dustbin Set',
    description: 'Color-coded 3-bin set with smart sensors',
    price: 2499,
    category: 'dustbin',
    image: 'https://images.pexels.com/photos/4099354/pexels-photo-4099354.jpeg',
    inStock: true,
    rating: 4.5,
    reviews: 234
  },
  {
    id: 'u2',
    name: 'Home Composting Kit',
    description: 'Complete kit for home composting with instructions',
    price: 1299,
    category: 'compost_kit',
    image: 'https://images.pexels.com/photos/4099354/pexels-photo-4099354.jpeg',
    inStock: true,
    rating: 4.3,
    reviews: 156
  },
  {
    id: 'u3',
    name: 'Biodegradable Waste Bags',
    description: 'Eco-friendly waste collection bags (pack of 50)',
    price: 299,
    category: 'recycling_bag',
    image: 'https://images.pexels.com/photos/4099354/pexels-photo-4099354.jpeg',
    inStock: true,
    rating: 4.1,
    reviews: 89
  }
];

export function FacilitiesProvider({ children }: { children: React.ReactNode }) {
  const [facilities] = useState<WasteFacility[]>(sampleFacilities);
  const [vehicles] = useState<CollectionVehicle[]>(sampleVehicles);
  const [utilities] = useState<WasteUtility[]>(sampleUtilities);

  const findNearbyFacilities = (lat: number, lng: number, wasteType?: string) => {
    // Simple distance calculation (in real app, use proper geolocation)
    return facilities.filter(facility => {
      if (wasteType && !facility.acceptedWasteTypes.includes(wasteType)) {
        return false;
      }
      const distance = Math.sqrt(
        Math.pow(facility.location.lat - lat, 2) + 
        Math.pow(facility.location.lng - lng, 2)
      );
      return distance < 0.5; // Within ~50km radius
    });
  };

  const trackVehicle = (vehicleId: string) => {
    return vehicles.find(v => v.id === vehicleId);
  };

  const purchaseUtility = (utilityId: string, quantity: number) => {
    console.log(`Purchasing ${quantity} of utility ${utilityId}`);
    // In real app, integrate with payment gateway
  };

  return (
    <FacilitiesContext.Provider value={{
      facilities,
      vehicles,
      utilities,
      findNearbyFacilities,
      trackVehicle,
      purchaseUtility
    }}>
      {children}
    </FacilitiesContext.Provider>
  );
}