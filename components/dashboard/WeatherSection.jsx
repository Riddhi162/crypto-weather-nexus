import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCityWeather } from '../../store/slices/weatherSlice';
import { addFavoriteCity, removeFavoriteCity } from '../../store/slices/userPreferencesSlice';
import { Cloud, CloudRain, CloudSnow, CloudLightning, Sun, CloudSun, Wind, Droplets, Plus, X, Thermometer, ArrowRight, Heart, AlertTriangle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Button from '../common/Button';
import NotificationManager from '../../components/common/NotificationManager';
import { NotificationType } from '../../components/common/Notification';

// Mock services for demo purposes
const mockWeatherService = {
  getActiveAlerts: () => {
    // Simulate weather alerts based on current conditions
    const alerts = [];
    const randomAlert = Math.random() > 0.7;
    
    if (randomAlert) {
      alerts.push({
        id: Date.now(),
        title: "Severe Weather Alert",
        description: "Thunderstorms expected in your area in the next 6 hours",
        notified: false
      });
    }
    
    return alerts;
  },
  markAlertAsNotified: (id) => {
    // In a real implementation, this would mark the alert as notified
    console.log(`Alert ${id} marked as notified`);
  }
};

const mockPriceService = {
  getLatestChange: () => {
    // Mock stock price changes for demo
    return null; // We're focusing on weather for this integration
  }
};

export default function WeatherSection() {
  const dispatch = useDispatch();
  const { currentWeather, loading, error } = useSelector((state) => state.weather);
  const { favoriteCities } = useSelector((state) => state.userPreferences);
  const [newCity, setNewCity] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeCity, setActiveCity] = useState('London');
  const router = useRouter();
  const activeWeather = currentWeather[activeCity];
  const [notificationRef, setNotificationRef] = useState(null);

  // Create a reference to hold notification API
  useEffect(() => {
    setNotificationRef(window.notificationApi);
  }, []);

  // Ensure London is in the favorites when component mounts
  useEffect(() => {
    if (!favoriteCities.includes('London')) {
      dispatch(addFavoriteCity('London'));
    }
    setActiveCity('London');
  }, []);

  const handleViewDetails = (city) => {
    router.push(`/city/${encodeURIComponent(city)}`);
  };
  
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

  // Show weather notifications when weather data changes
  useEffect(() => {
    if (!notificationRef || !activeWeather) return;
    
    // Check for extreme weather conditions and notify
    if (activeWeather.main && activeWeather.weather) {
      // Extreme temperature notifications
      const temp = activeWeather.main.temp;
      if (temp > 95) {
        notificationRef.warning(
          "Extreme Heat Alert",
          `Current temperature in ${activeCity} is ${Math.round(temp)}°F. Stay hydrated and avoid prolonged sun exposure.`,
          10000
        );
      } else if (temp < 32) {
        notificationRef.warning(
          "Freezing Conditions Alert",
          `Current temperature in ${activeCity} is ${Math.round(temp)}°F. Bundle up and be cautious of icy conditions.`,
          10000
        );
      }
      
      // Severe weather conditions notifications
      const weatherCondition = activeWeather.weather[0];
      if (weatherCondition) {
        const weatherId = weatherCondition.id;
        
        // Thunderstorm
        if (weatherId < 300) {
          notificationRef.weatherAlert(
            "Thunderstorm Alert",
            `Thunderstorms detected in ${activeCity}. Stay indoors if possible.`,
            8000
          );
        }
        // Heavy rain
        else if (weatherId >= 502 && weatherId <= 504) {
          notificationRef.weatherAlert(
            "Heavy Rain Alert",
            `Heavy rainfall in ${activeCity}. Be cautious of potential flooding.`,
            8000
          );
        }
        // Snow
        else if (weatherId >= 600 && weatherId < 700) {
          notificationRef.weatherAlert(
            "Snow Alert",
            `Snowy conditions in ${activeCity}. Drive carefully if going out.`,
            8000
          );
        }
      }
    }
  }, [activeWeather, activeCity, notificationRef]);

  const handleAddCity = (e) => {
    e.preventDefault();
    if (newCity.trim()) {
      dispatch(addFavoriteCity(newCity.trim()));
      dispatch(fetchCityWeather(newCity.trim()));
      setActiveCity(newCity.trim());
      setNewCity('');
      setShowAddForm(false);
      
      // Show success notification when adding a new city
      if (notificationRef) {
        notificationRef.success(
          "City Added",
          `${newCity.trim()} has been added to your cities.`,
          3000
        );
      }
    }
  };

  const handleToggleFavorite = (city) => {
    const isFavorite = favoriteCities.includes(city);
    
    if (isFavorite) {
      dispatch(removeFavoriteCity(city));
      if (activeCity === city) {
        setActiveCity(favoriteCities.length > 1 ? 
          favoriteCities.filter(c => c !== city)[0] : 'London');
      }
      
      // Show notification when removing city from favorites
      if (notificationRef) {
        notificationRef.info(
          "City Removed",
          `${city} has been removed from your favorites.`,
          3000
        );
      }
    } else {
      dispatch(addFavoriteCity(city));
      
      // Show notification when adding city to favorites
      if (notificationRef) {
        notificationRef.success(
          "Added to Favorites",
          `${city} has been added to your favorites.`,
          3000
        );
      }
    }
  };

  const handleRetry = () => {
    dispatch(fetchCityWeather(activeCity));
    
    // Show notification when retrying
    if (notificationRef) {
      notificationRef.info(
        "Refreshing Weather Data",
        `Attempting to retrieve fresh weather data for ${activeCity}.`,
        3000
      );
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
  
  const cityHasError = error && (!activeWeather || error.includes(activeCity));

  // Show error notification when fetching fails
  useEffect(() => {
    if (cityHasError && notificationRef) {
      notificationRef.error(
        "Weather Data Error",
        `Failed to load weather data for ${activeCity}. Please try again later.`,
        5000
      );
    }
  }, [cityHasError, activeCity, notificationRef]);

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

  return (
    <>
      {/* Notification Manager */}
      <NotificationManager 
        weatherService={mockWeatherService} 
        priceService={mockPriceService} 
      />


    <div className={`relative ${getBackgroundGradient()} rounded-3xl overflow-hidden p-1 shadow-xl`}>
    {/* Glassmorphism container */}
    <div className="backdrop-blur-md bg-white/5 rounded-3xl p-6 overflow-hidden h-full relative">
      {/* Floating orbs animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-teal-900/10 animate-float-slow blur-md"></div>
        <div className="absolute top-40 right-10 w-32 h-32 rounded-full bg-purple-900/10 animate-float blur-md"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 rounded-full bg-amber-900/10 animate-float-fast blur-md"></div>
      </div>

      {/* General Loading State */}
      {loading && !activeWeather && !error && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400"></div>
        </div>
      )}
      
      {/* Fallback UI for Error State */}
      <AnimatePresence mode="wait">
        {cityHasError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center h-64 text-center"
          >
            <div className="bg-red-900/20 backdrop-blur-sm text-red-400 p-6 rounded-xl mb-4 inline-flex items-center">
              <AlertTriangle size={24} className="mr-2" />
              <span>Unable to load weather data</span>
            </div>
            
            <p className="text-gray-400 mb-4">
              We couldn't retrieve weather information for {activeCity}
            </p>
            
            <button 
              onClick={handleRetry}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw size={16} />
              <span>Retry</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Normal Weather Display */}
      <AnimatePresence mode="wait">
        {activeWeather && !cityHasError && (
          <motion.div 
            key={activeCity}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-between min-h-64"
          >
            {/* City name and favorite button */}
            <div className="flex justify-between items-center w-full mb-6">
              <motion.h2 
                className={`text-3xl font-bold ${getTextColor()}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {activeCity}
              </motion.h2>
              <div className="flex gap-2">
                {/* Favorite heart button */}
                <button 
                  onClick={() => handleToggleFavorite(activeCity)}
                  className={`transition-colors ${
                    favoriteCities.includes(activeCity) 
                      ? 'text-red-500 hover:text-red-400' 
                      : 'text-gray-400 hover:text-red-400'
                  }`}
                  title={favoriteCities.includes(activeCity) ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart size={20} fill={favoriteCities.includes(activeCity) ? "currentColor" : "none"} />
                </button>
              </div>
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
              className="w-full backdrop-blur-lg bg-white/5 rounded-xl p-4 flex justify-between items-center shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center">
                <span className={`mr-2 ${getTextColor()}`}>{activeWeather.weather?.[0]?.main}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Droplets size={18} className="mr-1 text-teal-400" />
                  <span className={getTextColor()}>{activeWeather.main?.humidity}%</span>
                </div>
                
                {activeWeather.clouds && (
                  <div className="flex items-center">
                    <Cloud size={18} className="mr-1 text-gray-400" />
                    <span className={getTextColor()}>{activeWeather.clouds?.all}%</span>
                  </div>
                )}
              </div>

              <Link 
                href={`/city/${encodeURIComponent(activeCity)}`}
                className={`flex items-center justify-center gap-2 w-1/2 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors ${getTextColor()}`}
              >
                <span>View Detailed Forecast</span>
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* City selector tabs with heart icons */}
      <div className="mt-8">
        <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-2">
          {favoriteCities.map((city) => {
            const cityData = currentWeather[city];
            const isActive = activeCity === city;
            const cityError = error && error.includes(city);
            
            return (
              <motion.button
                key={city}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCity(city)}
                className={`relative flex flex-col items-center px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-white/10 backdrop-blur-md shadow-lg border border-white/10' 
                    : 'bg-white/5 backdrop-blur-sm hover:bg-white/10'
                }`}
              >
                {/* Heart icon for favorite city - small at top right corner */}
                <div className="absolute -top-1 -right-1">
                  <Heart size={12} className="text-red-500" fill="currentColor" />
                </div>
                
                {cityData && !cityError ? (
                  <>
                    <div className="flex items-center gap-1">
                      {getWeatherIcon(cityData.weather?.[0]?.id, 16)}
                      <span className={`text-sm font-medium ${getTextColor()}`}>
                        {formatTemp(cityData.main?.temp)}°
                      </span>
                    </div>
                    <span className={`text-xs mt-1 ${getTextColor()}`}>{city}</span>
                  </>
                ) : cityError ? (
                  <>
                    <AlertTriangle size={16} className="text-red-400" />
                    <span className={`text-xs mt-1 ${getTextColor()}`}>{city}</span>
                  </>
                ) : (
                  <>
                    <div className="animate-pulse w-8 h-4 bg-white/10 rounded mb-1"></div>
                    <span className={`text-xs ${getTextColor()}`}>{city}</span>
                  </>
                )}
              </motion.button>
            );
          })}
          
          {/* Show other cities that are not in favorites but have been searched */}
          {Object.keys(currentWeather)
            .filter(city => !favoriteCities.includes(city))
            .map(city => {
              const cityData = currentWeather[city];
              const isActive = activeCity === city;
              const cityError = error && error.includes(city);
              
              if (!cityData || cityError) return null;
              
              return (
                <motion.button
                  key={city}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCity(city)}
                  className={`relative flex flex-col items-center px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                    isActive 
                      ? 'bg-white/10 backdrop-blur-md shadow-lg border border-white/10' 
                      : 'bg-white/5 backdrop-blur-sm hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {getWeatherIcon(cityData.weather?.[0]?.id, 16)}
                    <span className={`text-sm font-medium ${getTextColor()}`}>
                      {formatTemp(cityData.main?.temp)}°
                    </span>
                  </div>
                  <span className={`text-xs mt-1 ${getTextColor()}`}>{city}</span>
                </motion.button>
              );
            })
          }
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="flex items-center justify-center px-4 py-2 rounded-xl whitespace-nowrap bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all"
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
              className="bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl w-full max-w-sm shadow-xl border border-gray-700"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <h3 className="text-xl font-semibold text-gray-100 mb-4">Add New City</h3>
              <div className="flex mb-4">
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="Enter city name"
                  className="flex-grow px-4 py-3 bg-gray-700/80 backdrop-blur-sm border border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-100 placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="bg-teal-600/80 backdrop-blur-sm text-white px-6 py-3 rounded-r-lg hover:bg-teal-500/80 transition"
                >
                  Add
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="addToFavorites"
                    defaultChecked={true}
                    className="w-4 h-4 accent-red-500"
                  />
                  <label htmlFor="addToFavorites" className="text-gray-300 text-sm">
                    Add to favorites
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-100 transition"
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
  </>
  );
}