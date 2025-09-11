import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      scanner: 'Scanner',
      training: 'Training',
      rewards: 'Rewards',
      community: 'Community',
      facilities: 'Facilities',
      profile: 'Profile',
      admin: 'Admin',
      
      // Common
      login: 'Login',
      signup: 'Sign Up',
      logout: 'Logout',
      save: 'Save',
      cancel: 'Cancel',
      submit: 'Submit',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      
      // Waste Types
      plastic: 'Plastic',
      paper: 'Paper',
      organic: 'Organic',
      metal: 'Metal',
      ewaste: 'E-Waste',
      glass: 'Glass',
      hazardous: 'Hazardous',
      
      // Scanner
      scanWaste: 'Scan Waste',
      takePhoto: 'Take Photo',
      uploadImage: 'Upload Image',
      analyzing: 'Analyzing image with AI...',
      wasteDetected: 'Waste Detected',
      disposalInstructions: 'Disposal Instructions',
      
      // Training
      trainingModules: 'Training Modules',
      startTraining: 'Start Training',
      completeModule: 'Complete Module',
      certificate: 'Certificate',
      progress: 'Progress',
      
      // Rewards
      ecoPoints: 'Eco Points',
      badges: 'Badges',
      achievements: 'Achievements',
      leaderboard: 'Leaderboard',
      currentLevel: 'Current Level',
      
      // Community
      challenges: 'Challenges',
      joinChallenge: 'Join Challenge',
      greenChampions: 'Green Champions',
      communityStats: 'Community Stats',
      
      // Facilities
      nearbyFacilities: 'Nearby Facilities',
      recyclingCenter: 'Recycling Center',
      scrapShop: 'Scrap Shop',
      wtePlant: 'Waste-to-Energy Plant',
      compostCenter: 'Compost Center',
      
      // Admin
      userManagement: 'User Management',
      wasteTracking: 'Waste Tracking',
      analytics: 'Analytics',
      penaltyManagement: 'Penalty Management'
    }
  },
  hi: {
    translation: {
      // Navigation
      dashboard: 'डैशबोर्ड',
      scanner: 'स्कैनर',
      training: 'प्रशिक्षण',
      rewards: 'पुरस्कार',
      community: 'समुदाय',
      facilities: 'सुविधाएं',
      profile: 'प्रोफ़ाइल',
      admin: 'एडमिन',
      
      // Common
      login: 'लॉगिन',
      signup: 'साइन अप',
      logout: 'लॉगआउट',
      save: 'सेव करें',
      cancel: 'रद्द करें',
      submit: 'जमा करें',
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      success: 'सफलता',
      
      // Waste Types
      plastic: 'प्लास्टिक',
      paper: 'कागज़',
      organic: 'जैविक',
      metal: 'धातु',
      ewaste: 'ई-वेस्ट',
      glass: 'कांच',
      hazardous: 'खतरनाक',
      
      // Scanner
      scanWaste: 'कचरा स्कैन करें',
      takePhoto: 'फोटो लें',
      uploadImage: 'इमेज अपलोड करें',
      analyzing: 'AI के साथ इमेज का विश्लेषण...',
      wasteDetected: 'कचरा पहचाना गया',
      disposalInstructions: 'निपटान निर्देश',
      
      // Training
      trainingModules: 'प्रशिक्षण मॉड्यूल',
      startTraining: 'प्रशिक्षण शुरू करें',
      completeModule: 'मॉड्यूल पूरा करें',
      certificate: 'प्रमाणपत्र',
      progress: 'प्रगति',
      
      // Rewards
      ecoPoints: 'इको पॉइंट्स',
      badges: 'बैज',
      achievements: 'उपलब्धियां',
      leaderboard: 'लीडरबोर्ड',
      currentLevel: 'वर्तमान स्तर',
      
      // Community
      challenges: 'चुनौतियां',
      joinChallenge: 'चुनौती में शामिल हों',
      greenChampions: 'ग्रीन चैंपियन',
      communityStats: 'समुदायिक आंकड़े',
      
      // Facilities
      nearbyFacilities: 'नजदीकी सुविधाएं',
      recyclingCenter: 'रीसाइक्लिंग सेंटर',
      scrapShop: 'स्क्रैप शॉप',
      wtePlant: 'वेस्ट-टू-एनर्जी प्लांट',
      compostCenter: 'कंपोस्ट सेंटर',
      
      // Admin
      userManagement: 'उपयोगकर्ता प्रबंधन',
      wasteTracking: 'कचरा ट्रैकिंग',
      analytics: 'एनालिटिक्स',
      penaltyManagement: 'जुर्माना प्रबंधन'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;