import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCityWeather } from '../../store/slices/weatherSlice';
import { addFavoriteCity, removeFavoriteCity } from '../../store/slices/userPreferencesSlice';
import { Cloud, CloudRain, CloudSnow, CloudLightning, Sun, CloudSun, Wind, Droplets, Plus, X, Thermometer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WeatherSection() {
  const dispatch = useDispatch();
  const { currentWeather, loading, error } = useSelector((state) => state.weather);
  const { favoriteCities } = useSelector((state) => state.userPreferences);
  const [newCity, setNewCity] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeCity, setActiveCity] = useState('London');
  
  // Ensure London is in the favorites when component mounts
  useEffect(() => {
    if (!favoriteCities.includes('London')) {
      dispatch(addFavoriteCity('London'));
    }
    setActiveCity('London');
  }, []);

  useEffect(() => {
    // Fetch weather data for all cities including active one
    const allCities = [...favoriteCities];
    if (!allCities.includes(activeCity) && activeCity) {
      allCities.push(activeCity);
    }
    
    allCities.forEach(city => {
      const existingData = currentWeather[city];
      const isDataStale = !existingData || Date.now() - existingData.timestamp > 600000;
      
      if (isDataStale) {
        dispatch(fetchCityWeather(city));
      }
    });
  }, [dispatch, favoriteCities, activeCity]);

  const handleAddCity = (e) => {
    e.preventDefault();
    if (newCity.trim()) {
      dispatch(addFavoriteCity(newCity.trim()));
      dispatch(fetchCityWeather(newCity.trim()));
      setActiveCity(newCity.trim());
      setNewCity('');
      setShowAddForm(false);
    }
  };

  const handleRemoveCity = (city) => {
    dispatch(removeFavoriteCity(city));
    if (activeCity === city) {
      setActiveCity(favoriteCities.length > 0 ? favoriteCities[0] : 'London');
    }
  };

  const getWeatherIcon = (condition, size = 24) => {
    if (!condition) return <CloudSun size={size} className="text-yellow-500" />;
    const code = condition;
    
    // Map OpenWeatherMap condition codes to Lucide icons
    if (code < 300) return <CloudLightning size={size} className="text-purple-500" />;
    if (code < 400) return <CloudRain size={size} className="text-blue-400" />;
    if (code < 600) return <CloudRain size={size} className="text-blue-600" />;
    if (code < 700) return <CloudSnow size={size} className="text-blue-200" />;
    if (code < 800) return <Wind size={size} className="text-gray-400" />;
    if (code === 800) return <Sun size={size} className="text-yellow-500" />;
    return <CloudSun size={size} className="text-yellow-400" />;
  };

  // Format temperature
  const formatTemp = (temp) => {
    return Math.round(temp);
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'day';
    if (hour >= 18 && hour < 21) return 'evening';
    return 'night';
  };

  const getBackgroundGradient = () => {
    const timeOfDay = getTimeOfDay();
    
    switch (timeOfDay) {
      case 'morning':
        return 'bg-gradient-to-br from-blue-300 to-orange-200';
      case 'day':
        return 'bg-gradient-to-br from-blue-400 to-blue-200';
      case 'evening':
        return 'bg-gradient-to-br from-orange-400 to-purple-500';
      case 'night':
        return 'bg-gradient-to-br from-blue-900 to-indigo-700';
      default:
        return 'bg-gradient-to-br from-blue-400 to-blue-200';
    }
  };
  
  const getTextColor = () => {
    const timeOfDay = getTimeOfDay();
    return timeOfDay === 'night' ? 'text-white' : 'text-gray-800';
  };

  const activeWeather = currentWeather[activeCity];

  return (
    <div className={`relative ${getBackgroundGradient()} rounded-3xl overflow-hidden p-1 shadow-xl`}>
      {/* Glassmorphism container */}
      <div className="backdrop-blur-md bg-white/20 rounded-3xl p-6 overflow-hidden h-full relative">
        {/* Floating orbs animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/10 animate-float-slow blur-md"></div>
          <div className="absolute top-40 right-10 w-32 h-32 rounded-full bg-white/10 animate-float blur-md"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 rounded-full bg-white/10 animate-float-fast blur-md"></div>
        </div>
        
        {loading && !activeWeather && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-400/30 backdrop-blur-sm text-red-900 p-4 rounded-xl text-center my-4">
            Error loading weather data. Please try again.
          </div>
        )}
        
        <AnimatePresence mode="wait">
          {activeWeather && (
            <motion.div 
              key={activeCity}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-between min-h-64"
            >
              {/* City name and remove button */}
              <div className="flex justify-between items-center w-full mb-6">
                <motion.h2 
                  className={`text-3xl font-bold ${getTextColor()}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {activeCity}
                </motion.h2>
                {favoriteCities.includes(activeCity) && (
                  <button 
                    onClick={() => handleRemoveCity(activeCity)}
                    className="text-white/70 hover:text-red-400 transition-colors"
                    title="Remove city"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              
              {/* Main weather display */}
              <motion.div 
                className="flex flex-col items-center mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="mb-2 transform hover:scale-110 transition-transform">
                  {getWeatherIcon(activeWeather.weather?.[0]?.id, 72)}
                </div>
                <motion.div 
                  className={`text-6xl font-extrabold my-4 ${getTextColor()}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {formatTemp(activeWeather.main?.temp)}°F
                </motion.div>
              </motion.div>
              
              {/* Weather details */}
              <motion.div 
                className="w-full backdrop-blur-lg bg-white/10 rounded-xl p-4 flex justify-between items-center shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center">
                  <span className={`mr-2 ${getTextColor()}`}>{activeWeather.weather?.[0]?.main}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Droplets size={18} className="mr-1 text-blue-400" />
                    <span className={getTextColor()}>{activeWeather.main?.humidity}%</span>
                  </div>
                  
                  {activeWeather.clouds && (
                    <div className="flex items-center">
                      <Cloud size={18} className="mr-1 text-gray-200" />
                      <span className={getTextColor()}>{activeWeather.clouds?.all}%</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* City selector tabs */}
        <div className="mt-8">
          <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2">
            {favoriteCities.map((city) => {
              const cityData = currentWeather[city];
              const isActive = activeCity === city;
              
              return (
                <motion.button
                  key={city}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCity(city)}
                  className={`flex flex-col items-center px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                    isActive 
                      ? 'bg-white/30 backdrop-blur-md shadow-lg' 
                      : 'bg-white/10 backdrop-blur-sm hover:bg-white/20'
                  }`}
                >
                  {cityData ? (
                    <>
                      <div className="flex items-center gap-1">
                        {getWeatherIcon(cityData.weather?.[0]?.id, 16)}
                        <span className={`text-sm font-medium ${getTextColor()}`}>
                          {formatTemp(cityData.main?.temp)}°
                        </span>
                      </div>
                      <span className={`text-xs mt-1 ${getTextColor()}`}>{city}</span>
                    </>
                  ) : (
                    <>
                      <div className="animate-pulse w-8 h-4 bg-white/20 rounded mb-1"></div>
                      <span className={`text-xs ${getTextColor()}`}>{city}</span>
                    </>
                  )}
                </motion.button>
              );
            })}
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
              className="flex items-center justify-center px-4 py-2 rounded-xl whitespace-nowrap bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
            >
              <Plus size={16} className={getTextColor()} />
            </motion.button>
          </div>
        </div>
        
        {/* Add city form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-0 backdrop-blur-xl bg-black/80 rounded-3xl flex items-center justify-center p-6"
            >
              <motion.form 
                onSubmit={handleAddCity}
                className="bg-white/20 backdrop-blur-[600px] p-6 rounded-xl w-full max-w-sm shadow-xl border border-white/20"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
              >
                <h3 className="text-xl font-semibold text-white mb-4">Add New City</h3>
                <div className="flex mb-4">
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="Enter city name"
                    className="flex-grow px-4 py-3 bg-white/30 backdrop-blur-sm border border-white/20 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500/80 backdrop-blur-sm text-white px-6 py-3 rounded-r-lg hover:bg-blue-600/80 transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-white/80 hover:text-white transition"
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Add required animation classes to your tailwind config */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 6s ease-in-out infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}