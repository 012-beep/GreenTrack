export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'citizen' | 'waste_worker' | 'ulb_admin' | 'green_champion';
  ecoPoints: number;
  level: number;
  badges: string[];
  joinedDate: string;
  totalScans: number;
  location: {
    lat: number;
    lng: number;
    address: string;
    area: string;
    city: string;
  };
  trainingProgress: TrainingProgress[];
  certificates: Certificate[];
  penaltyLog: Penalty[];
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'quiz' | 'interactive';
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'segregation' | 'composting' | 'recycling' | 'safety';
  content: {
    videoUrl?: string;
    quizQuestions?: QuizQuestion[];
    materials?: string[];
  };
  requiredFor: ('citizen' | 'waste_worker' | 'green_champion')[];
}

export interface TrainingProgress {
  moduleId: string;
  userId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score?: number;
  completedAt?: string;
  timeSpent: number; // in minutes
}

export interface Certificate {
  id: string;
  userId: string;
  type: 'waste_worker' | 'green_champion' | 'eco_expert';
  issuedDate: string;
  validUntil: string;
  modules: string[];
  score: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface WasteScan {
  id: string;
  userId: string;
  imageUrl?: string;
  wasteType: string;
  confidence: number;
  timestamp: string;
  pointsEarned: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  geoTagged: boolean;
  verified: boolean;
  reportedIssue?: boolean;
}

export interface WasteFacility {
  id: string;
  name: string;
  type: 'recycling_center' | 'scrap_shop' | 'wte_plant' | 'compost_center';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  acceptedWasteTypes: string[];
  operatingHours: string;
  contact: string;
  rating: number;
  verified: boolean;
}

export interface CollectionVehicle {
  id: string;
  vehicleNumber: string;
  driverName: string;
  route: string;
  currentLocation: {
    lat: number;
    lng: number;
  };
  status: 'active' | 'inactive' | 'maintenance';
  capacity: number;
  currentLoad: number;
  schedule: CollectionSchedule[];
}

export interface CollectionSchedule {
  area: string;
  time: string;
  wasteType: string[];
  estimatedDuration: number;
}

export interface Penalty {
  id: string;
  userId: string;
  reason: string;
  amount: number;
  status: 'pending' | 'paid' | 'disputed';
  issuedDate: string;
  dueDate: string;
  evidence: string[];
  issuedBy: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  reward: number;
  endDate: string;
  type: 'individual' | 'community' | 'area' | 'city';
  category: 'segregation' | 'collection' | 'recycling' | 'awareness';
  participants: string[];
  area?: string;
}

export interface WasteUtility {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'dustbin' | 'compost_kit' | 'recycling_bag' | 'safety_gear';
  image: string;
  inStock: boolean;
  rating: number;
  reviews: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'training' | 'collection' | 'challenge' | 'penalty' | 'reward';
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}