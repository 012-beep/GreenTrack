import React, { createContext, useContext, useState } from 'react';
import { TrainingModule, TrainingProgress, Certificate, QuizQuestion } from '../types';

interface TrainingContextType {
  modules: TrainingModule[];
  userProgress: TrainingProgress[];
  certificates: Certificate[];
  startModule: (moduleId: string) => void;
  completeModule: (moduleId: string, score: number) => void;
  updateProgress: (moduleId: string, timeSpent: number) => void;
  generateCertificate: (userId: string, moduleIds: string[]) => void;
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export function useTraining() {
  const context = useContext(TrainingContext);
  if (context === undefined) {
    throw new Error('useTraining must be used within a TrainingProvider');
  }
  return context;
}

const comprehensiveModules: TrainingModule[] = [
  {
    id: 'module-1',
    title: 'Waste Management Fundamentals',
    description: 'Master the basics of waste management, environmental impact, and the circular economy principles',
    type: 'video',
    duration: 20,
    difficulty: 'beginner',
    category: 'segregation',
    content: {
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      materials: [
        'Understanding the waste hierarchy: Reduce, Reuse, Recycle, Recover',
        'Global waste statistics and environmental impact',
        'Introduction to circular economy principles',
        'Types of waste: Municipal, Industrial, Hazardous, E-waste',
        'Waste generation patterns in urban areas',
        'Economic benefits of proper waste management'
      ]
    },
    requiredFor: ['citizen', 'waste_worker', 'green_champion']
  },
  {
    id: 'module-2',
    title: 'Advanced Waste Segregation Techniques',
    description: 'Learn professional-grade waste segregation methods and color-coding systems',
    type: 'interactive',
    duration: 25,
    difficulty: 'intermediate',
    category: 'segregation',
    content: {
      materials: [
        'Multi-stream segregation: 5-bin system implementation',
        'Color coding standards: Green, Blue, Yellow, Red, Black bins',
        'Wet waste identification and handling',
        'Dry recyclable waste sorting techniques',
        'Hazardous waste identification and separation',
        'Common segregation mistakes and how to avoid them',
        'Setting up segregation systems in homes and offices'
      ]
    },
    requiredFor: ['citizen', 'waste_worker', 'green_champion']
  },
  {
    id: 'module-3',
    title: 'Plastic Waste Management & Recycling',
    description: 'Comprehensive guide to plastic types, recycling codes, and proper disposal methods',
    type: 'quiz',
    duration: 30,
    difficulty: 'intermediate',
    category: 'recycling',
    content: {
      quizQuestions: [
        {
          id: 'q1',
          question: 'Which plastic recycling code indicates PET bottles commonly used for beverages?',
          options: ['Code 1 (PET)', 'Code 2 (HDPE)', 'Code 3 (PVC)', 'Code 4 (LDPE)'],
          correctAnswer: 0,
          explanation: 'PET (Polyethylene Terephthalate) bottles have recycling code 1 and are highly recyclable. They are commonly used for water and soft drink bottles.'
        },
        {
          id: 'q2',
          question: 'What is the most important step before recycling plastic containers?',
          options: ['Breaking them into pieces', 'Removing labels completely', 'Cleaning thoroughly and removing food residue', 'Sorting by color only'],
          correctAnswer: 2,
          explanation: 'Cleaning plastic containers thoroughly removes food residue and contaminants, making the recycling process more effective and preventing contamination of other recyclables.'
        },
        {
          id: 'q3',
          question: 'Which type of plastic is generally NOT accepted in curbside recycling programs?',
          options: ['PET bottles (Code 1)', 'Plastic shopping bags', 'HDPE containers (Code 2)', 'PP containers (Code 5)'],
          correctAnswer: 1,
          explanation: 'Plastic bags can jam recycling machinery and should be taken to special drop-off locations at grocery stores or retail centers.'
        },
        {
          id: 'q4',
          question: 'What does the number 7 in the recycling triangle indicate?',
          options: ['Highly recyclable plastic', 'Biodegradable plastic', 'Mixed or other plastics', 'Single-use plastic only'],
          correctAnswer: 2,
          explanation: 'Code 7 indicates "Other" plastics, which include mixed plastics or newer plastic types. These are generally harder to recycle and require special handling.'
        },
        {
          id: 'q5',
          question: 'Which plastic type is commonly used for milk jugs and detergent bottles?',
          options: ['PET (Code 1)', 'HDPE (Code 2)', 'PVC (Code 3)', 'PS (Code 6)'],
          correctAnswer: 1,
          explanation: 'HDPE (High-Density Polyethylene) is used for milk jugs, detergent bottles, and other containers requiring durability and chemical resistance.'
        }
      ],
      materials: [
        'Complete guide to plastic recycling codes 1-7',
        'Microplastics and environmental impact',
        'Plastic alternatives and reduction strategies',
        'Industrial plastic recycling processes',
        'Quality degradation in plastic recycling'
      ]
    },
    requiredFor: ['citizen', 'waste_worker']
  },
  {
    id: 'module-4',
    title: 'Organic Waste & Composting Mastery',
    description: 'Complete guide to organic waste management, composting techniques, and biogas production',
    type: 'video',
    duration: 35,
    difficulty: 'intermediate',
    category: 'composting',
    content: {
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      materials: [
        'Home composting setup: Bin selection and placement',
        'Carbon-Nitrogen ratio: Brown vs Green materials',
        'Aerobic vs Anaerobic composting methods',
        'Troubleshooting: Odor, pests, and slow decomposition',
        'Vermicomposting: Using worms for faster composting',
        'Community composting programs and benefits',
        'Using finished compost in gardening and agriculture',
        'Bokashi composting: Fermentation method',
        'Large-scale organic waste processing'
      ]
    },
    requiredFor: ['citizen', 'green_champion']
  },
  {
    id: 'module-5',
    title: 'Electronic Waste Management',
    description: 'Comprehensive e-waste handling, data security, and precious metal recovery',
    type: 'video',
    duration: 28,
    difficulty: 'advanced',
    category: 'recycling',
    content: {
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      materials: [
        'E-waste categories: IT equipment, appliances, batteries',
        'Data security: Proper data wiping and destruction',
        'Precious metal recovery from electronic components',
        'Authorized e-waste collection and recycling centers',
        'Environmental hazards of improper e-waste disposal',
        'Extended Producer Responsibility (EPR) for electronics',
        'Refurbishment vs recycling decision matrix',
        'Battery handling and recycling procedures',
        'International e-waste trade regulations'
      ]
    },
    requiredFor: ['waste_worker', 'green_champion']
  },
  {
    id: 'module-6',
    title: 'Occupational Safety in Waste Management',
    description: 'Essential safety protocols, PPE usage, and emergency procedures for waste workers',
    type: 'quiz',
    duration: 25,
    difficulty: 'beginner',
    category: 'safety',
    content: {
      quizQuestions: [
        {
          id: 'q1',
          question: 'What is the minimum PPE required when handling mixed municipal waste?',
          options: ['Gloves only', 'Gloves and safety glasses', 'Full PPE: gloves, mask, goggles, protective clothing', 'No protection needed for municipal waste'],
          correctAnswer: 2,
          explanation: 'Full PPE is essential when handling any waste to protect against cuts, infections, chemical exposure, and respiratory hazards.'
        },
        {
          id: 'q2',
          question: 'How should needles and sharp medical waste be disposed of?',
          options: ['Regular waste bin', 'Wrapped in newspaper', 'Puncture-proof sharps container', 'Recycling bin'],
          correctAnswer: 2,
          explanation: 'Sharp medical waste must be placed in specially designed puncture-proof containers to prevent injuries and disease transmission.'
        },
        {
          id: 'q3',
          question: 'What is the first step when encountering unknown chemical waste?',
          options: ['Touch it to identify texture', 'Smell it to identify', 'Assess visually from safe distance', 'Mix with other waste'],
          correctAnswer: 2,
          explanation: 'Always maintain safe distance and assess unknown waste visually first. Never touch or smell unknown chemicals.'
        },
        {
          id: 'q4',
          question: 'How often should safety equipment be inspected?',
          options: ['Once a year', 'Once a month', 'Before each use', 'Only when damaged'],
          correctAnswer: 2,
          explanation: 'Safety equipment should be inspected before each use to ensure it is in proper working condition and will provide adequate protection.'
        }
      ],
      materials: [
        'Personal Protective Equipment (PPE) selection and maintenance',
        'Hazard identification and risk assessment',
        'Emergency response procedures and first aid',
        'Safe lifting techniques and ergonomics',
        'Chemical safety and MSDS interpretation'
      ]
    },
    requiredFor: ['waste_worker']
  },
  {
    id: 'module-7',
    title: 'Paper & Cardboard Recycling Systems',
    description: 'Advanced paper recycling processes, contamination prevention, and quality management',
    type: 'video',
    duration: 22,
    difficulty: 'beginner',
    category: 'recycling',
    content: {
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      materials: [
        'Paper grades: Newsprint, office paper, cardboard, mixed paper',
        'Contamination sources: inks, adhesives, plastics, food residue',
        'De-inking processes in paper recycling mills',
        'Fiber degradation and recycling limits',
        'Corrugated cardboard vs paperboard recycling',
        'Wax-coated and plastic-lined paper handling',
        'Paper recycling economics and market dynamics',
        'Sustainable forestry and virgin paper alternatives'
      ]
    },
    requiredFor: ['citizen', 'waste_worker']
  },
  {
    id: 'module-8',
    title: 'Hazardous Waste Identification & Management',
    description: 'Professional hazardous waste handling, classification, and emergency response',
    type: 'interactive',
    duration: 40,
    difficulty: 'advanced',
    category: 'safety',
    content: {
      materials: [
        'Hazardous waste classification: Ignitable, Corrosive, Reactive, Toxic',
        'Household hazardous waste: paints, solvents, pesticides, batteries',
        'Chemical compatibility and storage requirements',
        'Manifest system and chain of custody documentation',
        'Treatment, Storage, and Disposal Facility (TSDF) requirements',
        'Emergency spill response and containment procedures',
        'Personal protective equipment for hazardous materials',
        'Regulatory compliance and reporting requirements',
        'Waste minimization and source reduction strategies'
      ]
    },
    requiredFor: ['waste_worker', 'green_champion']
  },
  {
    id: 'module-9',
    title: 'Community Engagement & Behavior Change',
    description: 'Leadership skills for driving community-wide waste reduction and environmental awareness',
    type: 'video',
    duration: 45,
    difficulty: 'intermediate',
    category: 'awareness',
    content: {
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      materials: [
        'Community needs assessment and stakeholder mapping',
        'Designing effective environmental education campaigns',
        'Organizing successful community clean-up events',
        'Building partnerships with schools, businesses, and NGOs',
        'Using social media for environmental awareness',
        'Measuring and communicating environmental impact',
        'Overcoming resistance to behavior change',
        'Grant writing for community environmental projects',
        'Sustaining long-term community engagement',
        'Cultural sensitivity in environmental messaging'
      ]
    },
    requiredFor: ['green_champion']
  },
  {
    id: 'module-10',
    title: 'Waste-to-Energy & Advanced Treatment Technologies',
    description: 'Modern waste treatment technologies, energy recovery, and sustainable waste management systems',
    type: 'video',
    duration: 38,
    difficulty: 'advanced',
    category: 'recycling',
    content: {
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      materials: [
        'Incineration technology and emission control systems',
        'Anaerobic digestion and biogas production',
        'Pyrolysis and gasification for waste-to-fuel conversion',
        'Mechanical Biological Treatment (MBT) systems',
        'Landfill gas capture and utilization',
        'Life cycle assessment of waste treatment options',
        'Economic analysis of waste-to-energy projects',
        'Environmental impact assessment and mitigation',
        'Integration with renewable energy systems',
        'Future technologies: plasma gasification, AI sorting'
      ]
    },
    requiredFor: ['waste_worker', 'green_champion']
  },
  {
    id: 'module-11',
    title: 'Glass Recycling & Processing',
    description: 'Specialized glass waste management, color sorting, and recycling processes',
    type: 'video',
    duration: 18,
    difficulty: 'beginner',
    category: 'recycling',
    content: {
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      materials: [
        'Glass types: Container glass, flat glass, specialty glass',
        'Color separation: Clear, brown, green glass sorting',
        'Contamination removal: labels, caps, ceramics',
        'Glass crushing and cullet preparation',
        'Furnace-ready cullet specifications',
        'Energy savings from glass recycling',
        'Safety procedures for glass handling',
        'Quality control in glass recycling'
      ]
    },
    requiredFor: ['citizen', 'waste_worker']
  },
  {
    id: 'module-12',
    title: 'Metal Recovery & Scrap Management',
    description: 'Advanced metal identification, sorting, and recovery techniques',
    type: 'interactive',
    duration: 26,
    difficulty: 'intermediate',
    category: 'recycling',
    content: {
      materials: [
        'Ferrous vs non-ferrous metal identification',
        'Aluminum can processing and preparation',
        'Steel recycling and magnetic separation',
        'Copper wire recovery and grading',
        'Precious metal recovery from electronics',
        'Metal contamination and quality issues',
        'Scrap metal market dynamics and pricing',
        'Safety in metal handling and processing',
        'Advanced sorting technologies'
      ]
    },
    requiredFor: ['waste_worker', 'green_champion']
  },
  {
    id: 'module-13',
    title: 'Textile Waste & Circular Fashion',
    description: 'Textile recycling, upcycling, and sustainable fashion practices',
    type: 'video',
    duration: 24,
    difficulty: 'intermediate',
    category: 'recycling',
    content: {
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      materials: [
        'Textile waste streams: post-consumer and post-industrial',
        'Fiber identification and sorting techniques',
        'Mechanical vs chemical textile recycling',
        'Upcycling and creative reuse projects',
        'Donation and resale market dynamics',
        'Fast fashion environmental impact',
        'Sustainable fashion alternatives',
        'Textile collection and processing systems'
      ]
    },
    requiredFor: ['citizen', 'green_champion']
  },
  {
    id: 'module-14',
    title: 'Construction & Demolition Waste',
    description: 'C&D waste management, material recovery, and sustainable construction practices',
    type: 'video',
    duration: 32,
    difficulty: 'advanced',
    category: 'recycling',
    content: {
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      materials: [
        'C&D waste composition and generation rates',
        'On-site waste reduction and material optimization',
        'Concrete crushing and aggregate recovery',
        'Wood waste processing and biomass applications',
        'Metal recovery from demolition sites',
        'Hazardous material identification in old buildings',
        'Deconstruction vs demolition techniques',
        'Green building certification and waste diversion',
        'Economic benefits of C&D waste recycling'
      ]
    },
    requiredFor: ['waste_worker', 'green_champion']
  },
  {
    id: 'module-15',
    title: 'Smart Waste Management Technologies',
    description: 'IoT sensors, AI sorting, and digital solutions for modern waste management',
    type: 'interactive',
    duration: 30,
    difficulty: 'advanced',
    category: 'awareness',
    content: {
      materials: [
        'IoT sensors for bin monitoring and route optimization',
        'AI-powered waste sorting and contamination detection',
        'Blockchain for waste tracking and circular economy',
        'Mobile apps for citizen engagement and reporting',
        'Data analytics for waste generation prediction',
        'Smart city integration and waste management',
        'Robotics in waste processing facilities',
        'Digital twin technology for waste system modeling',
        'Cybersecurity in smart waste systems'
      ]
    },
    requiredFor: ['green_champion']
  }
];

export function TrainingProvider({ children }: { children: React.ReactNode }) {
  const [modules] = useState<TrainingModule[]>(comprehensiveModules);
  const [userProgress, setUserProgress] = useState<TrainingProgress[]>([
    {
      moduleId: 'module-1',
      userId: '1',
      status: 'completed',
      score: 92,
      completedAt: '2024-12-15T10:30:00Z',
      timeSpent: 20
    },
    {
      moduleId: 'module-2',
      userId: '1',
      status: 'in_progress',
      timeSpent: 15
    },
    {
      moduleId: 'module-3',
      userId: '1',
      status: 'completed',
      score: 88,
      completedAt: '2024-12-18T14:20:00Z',
      timeSpent: 30
    }
  ]);
  
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: 'cert-1',
      userId: '1',
      type: 'waste_worker',
      issuedDate: '2024-12-18T15:00:00Z',
      validUntil: '2025-12-18T15:00:00Z',
      modules: ['module-1', 'module-3'],
      score: 90
    }
  ]);

  const startModule = (moduleId: string) => {
    const existingProgress = userProgress.find(p => p.moduleId === moduleId);
    if (!existingProgress) {
      setUserProgress(prev => [...prev, {
        moduleId,
        userId: '1',
        status: 'in_progress',
        timeSpent: 0
      }]);
    }
  };

  const completeModule = (moduleId: string, score: number) => {
    setUserProgress(prev => prev.map(p => 
      p.moduleId === moduleId 
        ? { ...p, status: 'completed', score, completedAt: new Date().toISOString() }
        : p
    ));

    // Auto-generate certificate if user completes enough modules
    const completedModules = userProgress.filter(p => p.status === 'completed').length;
    if (completedModules >= 3 && certificates.length === 0) {
      generateCertificate('1', ['module-1', 'module-2', 'module-3']);
    }
  };

  const updateProgress = (moduleId: string, timeSpent: number) => {
    setUserProgress(prev => prev.map(p => 
      p.moduleId === moduleId 
        ? { ...p, timeSpent: p.timeSpent + timeSpent }
        : p
    ));
  };

  const generateCertificate = (userId: string, moduleIds: string[]) => {
    const newCertificate: Certificate = {
      id: `cert-${Date.now()}`,
      userId,
      type: 'eco_expert',
      issuedDate: new Date().toISOString(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      modules: moduleIds,
      score: 90
    };
    setCertificates(prev => [...prev, newCertificate]);
  };

  return (
    <TrainingContext.Provider value={{
      modules,
      userProgress,
      certificates,
      startModule,
      completeModule,
      updateProgress,
      generateCertificate
    }}>
      {children}
    </TrainingContext.Provider>
  );
}