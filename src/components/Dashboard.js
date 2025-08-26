import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import stravaService from '../services/stravaService';
import nameGenerator from '../services/nameGenerator';
import { 
  LogOut, 
  User, 
  Activity, 
  Download, 
  RefreshCw, 
  Settings,
  Clock,
  MapPin,
  TrendingUp,
  Trophy,
  Zap,
  Heart,
  Mountain,
  Dumbbell,
  Footprints,
  BarChart3,
  Target,
  Flame,
  X,
  AlertTriangle
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [athlete, setAthlete] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('funny');
  const [lastImportTime, setLastImportTime] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [athleteData, activitiesData] = await Promise.all([
        stravaService.getAthlete(),
        stravaService.getActivities(1, 20)
      ]);
      
      setAthlete(athleteData);
      setActivities(activitiesData);
      
      // Load last import time
      const lastImport = localStorage.getItem('last_import_timestamp');
      if (lastImport) {
        setLastImportTime(new Date(parseInt(lastImport)));
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      if (error.message.includes('Token expired')) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    stravaService.logout();
    navigate('/');
  };

  const importNewActivities = async () => {
    // Show the inside joke error modal instead of actually importing
    setShowErrorModal(true);
    return;
    
    // Original import logic (commented out for the joke)
    /*
    try {
      setImporting(true);
      const lastImport = localStorage.getItem('last_import_timestamp') || 
        (Date.now() - 7 * 24 * 60 * 60 * 1000); // Default to 7 days ago
      
      const newActivities = await stravaService.getNewActivities(lastImport);
      
      if (newActivities.length > 0) {
        setActivities(prev => [...newActivities, ...prev]);
        localStorage.setItem('last_import_timestamp', Date.now().toString());
        setLastImportTime(new Date());
      }
      
      return newActivities;
    } catch (error) {
      console.error('Error importing activities:', error);
      throw error;
    } finally {
      setImporting(false);
    }
    */
  };

  const generateAndUpdateName = async (activity) => {
    try {
      const newName = nameGenerator.generateName(activity, selectedStyle);
      await stravaService.updateActivityName(activity.id, newName);
      
      // Update local state
      setActivities(prev => 
        prev.map(a => 
          a.id === activity.id ? { ...a, name: newName } : a
        )
      );
      
      return newName;
    } catch (error) {
      console.error('Error updating activity name:', error);
      throw error;
    }
  };

  const formatDistance = (distance) => {
    // Convert meters to miles (1 mile = 1609.34 meters)
    return (distance / 1609.34).toFixed(1);
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getActivityIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'run':
        return <Zap className="w-8 h-8 text-blue-400" style={{ filter: 'drop-shadow(0 0 20px rgba(96, 165, 250, 0.8))' }} />;
      case 'ride':
      case 'virtualride':
        return <TrendingUp className="w-8 h-8 text-green-400" style={{ filter: 'drop-shadow(0 0 20px rgba(74, 222, 128, 0.8))' }} />;
      case 'swim':
        return <Heart className="w-8 h-8 text-cyan-400" style={{ filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.8))' }} />;
      case 'hike':
        return <Mountain className="w-8 h-8 text-amber-400" style={{ filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.8))' }} />;
      case 'weighttraining':
      case 'strengthtraining':
      case 'gym':
        return <Dumbbell className="w-8 h-8 text-purple-400" style={{ filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.8))' }} />;
      case 'walk':
      case 'walking':
        return <Footprints className="w-8 h-8 text-emerald-400" style={{ filter: 'drop-shadow(0 0 20px rgba(52, 211, 153, 0.8))' }} />;
      default:
        return <Activity className="w-8 h-8 text-gray-400" style={{ filter: 'drop-shadow(0 0 20px rgba(156, 163, 175, 0.8))' }} />;
    }
  };

  const getActivityGradient = (type) => {
    switch (type?.toLowerCase()) {
      case 'run':
        return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
      case 'ride':
      case 'virtualride':
        return 'from-green-500/20 to-green-600/20 border-green-500/30';
      case 'swim':
        return 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30';
      case 'hike':
        return 'from-amber-500/20 to-amber-600/20 border-amber-500/30';
      case 'weighttraining':
      case 'strengthtraining':
      case 'gym':
        return 'from-purple-500/20 to-purple-600/20 border-purple-500/30';
      case 'walk':
      case 'walking':
        return 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30';
      default:
        return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  const namingStyles = [
    { id: 'funny', emoji: '😄', label: 'Funny' },
    { id: 'hardWork', emoji: '💪', label: 'Hard Work' },
    { id: 'serious', emoji: '🎯', label: 'Serious' },
    { id: 'descriptive', emoji: '📝', label: 'Descriptive' },
    { id: 'motivational', emoji: '🚀', label: 'Motivational' },
    { id: 'achievement', emoji: '🏆', label: 'Achievement' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center" style={{
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(75, 115, 255, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(255, 102, 244, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 40% 20%, rgba(254, 123, 2, 0.2) 0%, transparent 50%)
        `
      }}>
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-6" style={{ filter: 'drop-shadow(0 0 20px rgba(96, 165, 250, 0.5))' }}></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s', filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.5))' }}></div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3" style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.5)' }}>Loading Your Dashboard</h2>
          <p className="text-gray-300 text-lg">Fetching your Strava activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black" style={{
      backgroundImage: `
        radial-gradient(circle at 20% 50%, rgba(75, 115, 255, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255, 102, 244, 0.2) 0%, transparent 50%),
        radial-gradient(circle at 40% 20%, rgba(254, 123, 2, 0.2) 0%, transparent 50%)
      `
    }}>
      {/* Header */}
      <div className="bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 30px rgba(252, 76, 2, 0.5)' }}>
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent" style={{ textShadow: '0 0 20px rgba(252, 76, 2, 0.3)' }}>
                  Strava App
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {athlete && (
                <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-4 py-2 rounded-full border border-blue-500/20 backdrop-blur-sm">
                  {athlete.profile_medium ? (
                    <img 
                      src={athlete.profile_medium} 
                      alt={athlete.firstname} 
                      className="w-10 h-10 rounded-full border-2 border-blue-400/50 shadow-lg"
                      style={{ boxShadow: '0 0 20px rgba(96, 165, 250, 0.5)' }}
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 20px rgba(96, 165, 250, 0.5)' }}>
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-white">
                    {athlete.firstname} {athlete.lastname}
                  </span>
                </div>
              )}
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                style={{ boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)' }}
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-orange-500/10 rounded-3xl p-8 border border-white/10 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
              <div className="flex-1">
                <h2 className="text-4xl font-bold text-white mb-3" style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.3)' }}>
                  Welcome back, {athlete?.firstname}! 👋
                </h2>
                <p className="text-xl text-gray-300 mb-6">
                  Ready to transform your activities with creative names? Here's your fitness overview.
                </p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={importNewActivities}
                    disabled={importing}
                    className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-lg"
                    style={{ boxShadow: '0 0 30px rgba(252, 76, 2, 0.3)' }}
                  >
                    {importing ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                    <span>{importing ? 'Importing...' : 'Import New Activities'}</span>
                  </button>
                  
                  {lastImportTime && (
                    <div className="flex items-center space-x-2 text-sm text-gray-400 bg-black/20 px-3 py-2 rounded-lg">
                      <Clock className="w-4 h-4" />
                      <span>Last import: {lastImportTime.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 lg:mt-0 lg:ml-8">
                <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl" style={{ boxShadow: '0 0 40px rgba(252, 76, 2, 0.4)' }}>
                  <BarChart3 className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Primary Stats */}
          <div className="lg:col-span-2 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-3xl p-6 border border-orange-500/30 shadow-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2" style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-orange-300 uppercase tracking-wider">Total Activities</p>
                <p className="text-5xl font-bold text-white mb-2">{activities.length}</p>
                <p className="text-orange-200 text-sm">Your fitness journey</p>
              </div>
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 30px rgba(252, 76, 2, 0.5)' }}>
                <Activity className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="w-full bg-black/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{ width: `${Math.min((activities.length / 100) * 100, 100)}%` }}></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-3xl p-6 border border-blue-500/30 shadow-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2" style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-blue-300 uppercase tracking-wider">Total Distance</p>
                                 <p className="text-3xl font-bold text-white">
                   {(() => {
                     const totalMeters = activities.reduce((sum, activity) => sum + activity.distance, 0);
                     const totalMiles = totalMeters / 1609.34;
                     if (totalMiles > 1000) {
                       return `${(totalMiles / 1000).toFixed(1)}k mi`;
                     } else if (totalMiles > 100) {
                       return `${totalMiles.toFixed(0)} mi`;
                     } else {
                       return `${totalMiles.toFixed(1)} mi`;
                     }
                   })()}
                 </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}>
                <MapPin className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex items-center space-x-2 text-blue-200 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Distance covered</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-3xl p-6 border border-green-500/30 shadow-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2" style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-green-300 uppercase tracking-wider">Total Time</p>
                <p className="text-3xl font-bold text-white">
                  {(() => {
                    const totalSeconds = activities.reduce((sum, activity) => sum + activity.moving_time, 0);
                    const hours = Math.floor(totalSeconds / 3600);
                    return hours > 0 ? `${hours}h` : `${Math.floor(totalSeconds / 60)}m`;
                  })()}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)' }}>
                <Clock className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex items-center space-x-2 text-green-200 text-sm">
              <Flame className="w-4 h-4" />
              <span>Time invested</span>
            </div>
          </div>
        </div>

        {/* Secondary Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-3xl p-6 border border-purple-500/30 shadow-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2" style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-purple-300 uppercase tracking-wider">Elevation Gain</p>
                <p className="text-3xl font-bold text-white">
                  {activities.reduce((sum, activity) => sum + (activity.total_elevation_gain || 0), 0) > 1000 
                    ? `${(activities.reduce((sum, activity) => sum + (activity.total_elevation_gain || 0), 0) / 1000).toFixed(1)}k m`
                    : `${Math.round(activities.reduce((sum, activity) => sum + (activity.total_elevation_gain || 0), 0))} m`
                  }
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 30px rgba(168, 85, 247, 0.5)' }}>
                <Mountain className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex items-center space-x-2 text-purple-200 text-sm">
              <Target className="w-4 h-4" />
              <span>Climbing achieved</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 rounded-3xl p-6 border border-indigo-500/30 shadow-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2" style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-indigo-300 uppercase tracking-wider">Workout Variety</p>
                <p className="text-3xl font-bold text-white">
                  {(() => {
                    const types = new Set(activities.map(a => a.type?.toLowerCase()));
                    return types.size;
                  })()}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)' }}>
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex items-center space-x-2 text-indigo-200 text-sm">
              <Activity className="w-4 h-4" />
              <span>Different activities</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-3xl p-6 border border-cyan-500/30 shadow-2xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2" style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-cyan-300 uppercase tracking-wider">Avg. Duration</p>
                <p className="text-3xl font-bold text-white">
                  {(() => {
                    if (activities.length === 0) return '0m';
                    const avgSeconds = activities.reduce((sum, activity) => sum + activity.moving_time, 0) / activities.length;
                    const minutes = Math.floor(avgSeconds / 60);
                    return `${minutes}m`;
                  })()}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 30px rgba(34, 211, 238, 0.5)' }}>
                <Clock className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex items-center space-x-2 text-cyan-200 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Per activity</span>
            </div>
          </div>
        </div>

        {/* Naming Style Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-6">Choose Your Naming Style</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {namingStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 text-center ${
                  selectedStyle === style.id
                    ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/50 shadow-lg'
                    : 'bg-black/40 border-white/10 hover:border-white/20'
                }`}
                style={{
                  boxShadow: selectedStyle === style.id 
                    ? '0 0 30px rgba(139, 92, 246, 0.3)' 
                    : '0 4px 15px rgba(0, 0, 0, 0.3)'
                }}
              >
                <div className="text-4xl mb-2 filter drop-shadow-lg">{style.emoji}</div>
                <div className="text-sm font-medium text-white">{style.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activities.map((activity, index) => (
            <div 
              key={activity.id} 
              className="bg-black/60 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 hover:scale-105"
              style={{ 
                animationDelay: `${index * 100}ms`,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Activity Header */}
              <div className={`p-6 pb-4 bg-gradient-to-r ${getActivityGradient(activity.type)} border-b border-white/10`}>
                <div className="flex items-center justify-between mb-3">
                  {getActivityIcon(activity.type)}
                  <span className="text-xs font-semibold text-white/90 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                    {activity.type}
                  </span>
                </div>
                <h3 className="font-bold text-white text-lg line-clamp-2 leading-tight">
                  {activity.name || 'Untitled Activity'}
                </h3>
              </div>

              {/* Activity Details */}
              <div className="p-6 pt-4">
                <div className="space-y-4 mb-6">
                  {activity.distance > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-300">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">Distance</span>
                      </div>
                                             <span className="font-bold text-white">{formatDistance(activity.distance)} mi</span>
                    </div>
                  )}
                  
                  {activity.distance === 0 && (activity.type?.toLowerCase().includes('weight') || activity.type?.toLowerCase().includes('strength') || activity.type?.toLowerCase().includes('gym')) && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Dumbbell className="w-4 h-4" />
                        <span className="text-sm font-medium">Workout Type</span>
                      </div>
                      <span className="font-bold text-white">Strength Training</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Duration</span>
                    </div>
                    <span className="font-bold text-white">{formatDuration(activity.moving_time)}</span>
                  </div>
                  
                  {activity.total_elevation_gain > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Mountain className="w-4 h-4" />
                        <span className="text-sm font-medium">Elevation</span>
                      </div>
                      <span className="font-bold text-white">{Math.round(activity.total_elevation_gain)}m</span>
                    </div>
                  )}
                  
                  {/* Special handling for different activity types */}
                  {activity.type?.toLowerCase().includes('walk') && activity.distance < 1000 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Footprints className="w-4 h-4" />
                        <span className="text-sm font-medium">Activity</span>
                      </div>
                      <span className="font-bold text-white">Casual Walk</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Trophy className="w-4 h-4" />
                      <span className="text-sm font-medium">Date</span>
                    </div>
                    <span className="font-bold text-white">{formatDate(activity.start_date)}</span>
                  </div>
                </div>

                <button
                  onClick={() => generateAndUpdateName(activity)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
                  style={{ boxShadow: '0 0 30px rgba(252, 76, 2, 0.3)' }}
                >
                  Generate New Name
                </button>
              </div>
            </div>
          ))}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl" style={{ boxShadow: '0 0 40px rgba(75, 85, 99, 0.5)' }}>
              <Activity className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No activities found</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Import your activities from Strava to get started with generating creative names for your workouts!
            </p>
            <button
              onClick={importNewActivities}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              style={{ boxShadow: '0 0 30px rgba(252, 76, 2, 0.3)' }}
            >
              <Download className="w-5 h-5 inline mr-2" />
              Import Activities
            </button>
          </div>
        )}
      </div>

      {/* Inside Joke Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-3xl p-8 border border-red-500/30 shadow-2xl max-w-md w-full backdrop-blur-sm">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg" style={{ boxShadow: '0 0 30px rgba(239, 68, 68, 0.5)' }}>
                <AlertTriangle className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">🚫 Action Blocked</h3>
              
              <div className="bg-black/40 rounded-2xl p-6 mb-6 border border-red-500/20">
                <p className="text-lg font-semibold text-red-300 mb-2">You cannot perform this action while the model is checked out</p>
                <p className="text-sm text-gray-300">Please open FastApp Studio to check in the model before trying again.</p>
              </div>
              
              <button
                onClick={() => setShowErrorModal(false)}
                className="flex items-center space-x-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg mx-auto"
              >
                <X className="w-5 h-5" />
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
