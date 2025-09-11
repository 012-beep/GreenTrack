import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  BookOpen, 
  Award, 
  Clock,
  CheckCircle,
  Star,
  Download,
  Users,
  Target,
  Trophy,
  PlayCircle,
  FileText
} from 'lucide-react';
import { useTraining } from '../contexts/TrainingContext';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import ReactPlayer from 'react-player';

export default function Training() {
  const [activeTab, setActiveTab] = useState('modules');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const { modules, userProgress, certificates, startModule, completeModule } = useTraining();
  const { user } = useAuth();
  const { t } = useTranslation();

  const getModuleProgress = (moduleId: string) => {
    return userProgress.find(p => p.moduleId === moduleId);
  };

  const getProgressPercentage = () => {
    const userModules = modules.filter(m => m.requiredFor.includes(user?.role || 'citizen'));
    const completed = userProgress.filter(p => p.status === 'completed').length;
    return userModules.length > 0 ? Math.round((completed / userModules.length) * 100) : 0;
  };

  const handleStartModule = (moduleId: string) => {
    startModule(moduleId);
    setSelectedModule(moduleId);
  };

  const handleQuizSubmit = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module?.content.quizQuestions) return;

    let correct = 0;
    module.content.quizQuestions.forEach((q, index) => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / module.content.quizQuestions.length) * 100);
    completeModule(moduleId, score);
    setSelectedModule(null);
    setQuizAnswers({});
  };

  const userModules = modules.filter(m => m.requiredFor.includes(user?.role || 'citizen'));
  const completedModules = userProgress.filter(p => p.status === 'completed').length;
  const inProgressModules = userProgress.filter(p => p.status === 'in_progress').length;
  const totalTimeSpent = userProgress.reduce((acc, p) => acc + p.timeSpent, 0);
  const averageScore = userProgress.filter(p => p.score).length > 0 
    ? Math.round(userProgress.filter(p => p.score).reduce((acc, p) => acc + (p.score || 0), 0) / userProgress.filter(p => p.score).length)
    : 0;

  const tabs = [
    { id: 'modules', label: t('trainingModules'), count: userModules.length },
    { id: 'progress', label: t('progress'), count: completedModules },
    { id: 'certificates', label: 'Certificates', count: certificates.length }
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Training Center</h1>
        <p className="text-gray-600">
          Master waste management skills through interactive training modules
        </p>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Your Training Progress</h3>
            <p className="text-gray-600">Complete modules to earn certificates and advance your skills</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{getProgressPercentage()}%</div>
            <p className="text-sm text-gray-500">{completedModules}/{userModules.length} completed</p>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
            style={{ width: `${getProgressPercentage()}%` }}
          >
            <div className="absolute inset-0 bg-white bg-opacity-20 animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">{completedModules}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-600">
              {inProgressModules}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">{totalTimeSpent}</div>
            <div className="text-sm text-gray-600">Minutes Spent</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">
              {averageScore}%
            </div>
            <div className="text-sm text-gray-600">Avg Score</div>
          </div>
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
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.id
                    ? 'bg-white bg-opacity-20'
                    : 'bg-gray-200'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </motion.div>

      {/* Module Detail Modal */}
      {selectedModule && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedModule(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const module = modules.find(m => m.id === selectedModule);
              if (!module) return null;

              return (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">{module.title}</h2>
                    <button
                      onClick={() => setSelectedModule(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  {module.type === 'video' && (
                    <div className="space-y-4">
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <ReactPlayer
                          url={module.content.videoUrl}
                          width="100%"
                          height="100%"
                          controls
                        />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900">Learning Materials:</h3>
                        <ul className="space-y-1">
                          {module.content.materials?.map((material, index) => (
                            <li key={index} className="flex items-center space-x-2 text-gray-700">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>{material}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button
                        onClick={() => completeModule(module.id, 100)}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        Mark as Completed
                      </button>
                    </div>
                  )}

                  {module.type === 'quiz' && module.content.quizQuestions && (
                    <div className="space-y-6">
                      {module.content.quizQuestions.map((question, index) => (
                        <div key={question.id} className="space-y-3">
                          <h3 className="font-semibold text-gray-900">
                            {index + 1}. {question.question}
                          </h3>
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <label
                                key={optionIndex}
                                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  name={question.id}
                                  value={optionIndex}
                                  onChange={() => setQuizAnswers(prev => ({
                                    ...prev,
                                    [question.id]: optionIndex
                                  }))}
                                  className="text-green-600"
                                />
                                <span className="text-gray-700">{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => handleQuizSubmit(module.id)}
                        disabled={Object.keys(quizAnswers).length < module.content.quizQuestions.length}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Submit Quiz
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}
          </motion.div>
        </motion.div>
      )}

      {/* Tab Content */}
      {activeTab === 'modules' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {userModules.map((module, index) => {
            const progress = getModuleProgress(module.id);
            const isCompleted = progress?.status === 'completed';
            const isInProgress = progress?.status === 'in_progress';

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                      {isCompleted && (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-xs text-green-600 font-medium">
                            {progress?.score}%
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{module.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{module.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {module.type === 'video' ? <PlayCircle className="w-4 h-4" /> : 
                         module.type === 'quiz' ? <FileText className="w-4 h-4" /> : 
                         <BookOpen className="w-4 h-4" />}
                        <span className="capitalize">{module.type}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        module.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                        module.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {module.difficulty}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        module.category === 'segregation' ? 'bg-blue-100 text-blue-700' :
                        module.category === 'recycling' ? 'bg-green-100 text-green-700' :
                        module.category === 'composting' ? 'bg-orange-100 text-orange-700' :
                        module.category === 'safety' ? 'bg-red-100 text-red-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {module.category}
                      </span>
                    </div>
                  </div>
                </div>

                {isCompleted && progress?.score && (
                  <div className="bg-green-50 p-3 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-green-800 font-medium">Completed</span>
                        {progress.completedAt && (
                          <span className="text-green-600 text-xs">
                            {new Date(progress.completedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-green-800 font-medium">{progress.score}%</span>
                      </div>
                    </div>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStartModule(module.id)}
                  disabled={isInProgress}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                    isCompleted 
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : isInProgress
                      ? 'bg-orange-100 text-orange-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                  }`}
                >
                  {module.type === 'video' ? <Play className="w-4 h-4" /> : 
                   module.type === 'quiz' ? <FileText className="w-4 h-4" /> : 
                   <BookOpen className="w-4 h-4" />}
                  <span>
                    {isCompleted ? 'Review Module' : 
                     isInProgress ? 'Continue' : 
                     t('startTraining')}
                  </span>
                </motion.button>
              </motion.div>
            );
          })}
          
          {userModules.length === 0 && (
            <div className="col-span-full text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Training Modules Available</h3>
              <p className="text-gray-600">Training modules for your role are being prepared.</p>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'progress' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Overall Progress */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Training Statistics</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedModules}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {userProgress.filter(p => p.status === 'in_progress').length}
                </div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(userProgress.reduce((acc, p) => acc + p.timeSpent, 0))}
                </div>
                <div className="text-sm text-gray-600">Minutes Spent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(userProgress.filter(p => p.score).reduce((acc, p) => acc + (p.score || 0), 0) / userProgress.filter(p => p.score).length) || 0}
                </div>
                <div className="text-sm text-gray-600">Avg Score</div>
              </div>
            </div>
          </div>

          {/* Module Progress List */}
          <div className="space-y-4">
            {userProgress.map((progress) => {
              const module = modules.find(m => m.id === progress.moduleId);
              if (!module) return null;

              return (
                <div key={progress.moduleId} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        progress.status === 'completed' ? 'bg-green-100' :
                        progress.status === 'in_progress' ? 'bg-orange-100' :
                        'bg-gray-100'
                      }`}>
                        {progress.status === 'completed' ? 
                          <CheckCircle className="w-5 h-5 text-green-600" /> :
                          progress.status === 'in_progress' ?
                          <Clock className="w-5 h-5 text-orange-600" /> :
                          <BookOpen className="w-5 h-5 text-gray-600" />
                        }
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{module.title}</h4>
                        <p className="text-sm text-gray-600">
                          {progress.timeSpent} min spent
                          {progress.score && ` • ${progress.score}% score`}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      progress.status === 'completed' ? 'bg-green-100 text-green-800' :
                      progress.status === 'in_progress' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {progress.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {activeTab === 'certificates' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {certificates.length === 0 ? (
            <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Certificates Yet</h3>
              <p className="text-gray-600 mb-6">
                Complete training modules to earn your first certificate
              </p>
              <button
                onClick={() => setActiveTab('modules')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Start Training
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {cert.type.replace('_', ' ').toUpperCase()} Certificate
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Issued on {new Date(cert.issuedDate).toLocaleDateString()}
                    </p>
                    <div className="bg-green-50 p-3 rounded-lg mb-4">
                      <div className="flex items-center justify-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium text-green-800">Score: {cert.score}%</span>
                      </div>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Download Certificate</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}