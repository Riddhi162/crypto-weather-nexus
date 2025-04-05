import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCityWeather, fetchWeatherHistory, fetchCityForecast } from '../../store/slices/weatherSlice';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, BarChart2, Table, Thermometer, Droplets, Wind, CloudRain } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useRouter } from 'next/router';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import Button from '../common/Button';
export default function CityDetails() {
    const router = useRouter();
    const { cityName } = router.query; // Get route parameter
    const dispatch = useDispatch();
  
  const [activeTab, setActiveTab] = useState('forecast');
  const [viewMode, setViewMode] = useState('chart');
  
  const { currentWeather, forecasts, history, loading } = useSelector((state) => state.weather);
  const handleGoBack = () => {
    router.push('/'); // Navigate to home instead of navigate('/')
  };

  useEffect(() => {
    // Fetch current weather if not available or stale
    const existingData = currentWeather[cityName];
    const isDataStale = !existingData || Date.now() - existingData.timestamp > 600000;
    
    if (isDataStale) {
      dispatch(fetchCityWeather(cityName));
    }
    
    // Fetch forecast data if not available or stale
    const existingForecast = forecasts[cityName];
    const isForecastStale = !existingForecast || Date.now() - existingForecast.timestamp > 3600000;
    
    if (isForecastStale) {
      dispatch(fetchCityForecast(cityName));
    }
    
    // Fetch historical data when component mounts
    if (currentWeather[cityName] && !history[`${currentWeather[cityName].coord.lat},${currentWeather[cityName].coord.lon}`]) {
      dispatch(fetchWeatherHistory({
        lat: currentWeather[cityName].coord.lat,
        lon: currentWeather[cityName].coord.lon,
        days: 5
      }));
    }
  }, [dispatch, cityName, currentWeather, forecasts]);
  
  // Get city data
  const cityData = currentWeather[cityName];
  const forecastData = forecasts[cityName]?.data;
  
  // Get historical data if available
  const historyKey = cityData ? `${cityData.coord.lat},${cityData.coord.lon}` : null;
  const historyData = historyKey ? history[historyKey]?.data : null;
  
  // Process forecast data for charts
  const processedForecastData = forecastData?.list?.map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: new Date(item.dt * 1000).toLocaleDateString(),
    temp: Math.round(item.main.temp),
    feelsLike: Math.round(item.main.feels_like),
    humidity: item.main.humidity,
    windSpeed: Math.round(item.wind.speed),
    description: item.weather[0].description,
    icon: item.weather[0].icon,
    precipitation: item.pop * 100, // Probability of precipitation as percentage
    pressure: item.main.pressure
  }));
  
  // Group forecast by date
  const forecastByDate = {};
  if (processedForecastData) {
    processedForecastData.forEach(item => {
      if (!forecastByDate[item.date]) {
        forecastByDate[item.date] = [];
      }
      forecastByDate[item.date].push(item);
    });
  }
  
  // Process historical data
  const processedHistoryData = historyData?.map((day, index) => ({
    date: new Date((day.current.dt) * 1000).toLocaleDateString(),
    temp: Math.round(day.current.temp),
    feelsLike: Math.round(day.current.feels_like),
    humidity: day.current.humidity,
    windSpeed: Math.round(day.current.wind_speed),
    description: day.current.weather[0].description,
    icon: day.current.weather[0].icon,
    pressure: day.current.pressure,
    daysAgo: index + 1
  }));
  
  // Format temperature with degree symbol
  const formatTemp = (temp) => `${temp}°F`;
  
  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get weather icon URL
  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
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
  
  return (
    <div>
      <Navbar/>
    <div className={`min-h-screen ${getBackgroundGradient()} p-4 md:p-8`}>
      
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <button 
            onClick={handleGoBack} 
            className="flex items-center bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/30 transition-colors mr-4"
          >
            <ArrowLeft size={24} className={getTextColor()} />
          </button>
          
          <h1 className={`text-3xl md:text-4xl font-bold ${getTextColor()}`}>
            {cityName} Weather
          </h1>
        </div>

        
        {loading && !cityData && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
        
        {cityData && (
          <>
            {/* Current weather summary */}
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 mb-8 shadow-xl">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <img 
                    src={getWeatherIconUrl(cityData.weather[0].icon)} 
                    alt={cityData.weather[0].description} 
                    className="w-20 h-20"
                  />
                  <div className="ml-4">
                    <h2 className={`text-5xl font-bold ${getTextColor()}`}>
                      {Math.round(cityData.main.temp)}°F
                    </h2>
                    <p className={`text-lg capitalize ${getTextColor()}`}>
                      {cityData.weather[0].description}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Thermometer size={20} className="mr-2 text-red-400" />
                    <span className={`${getTextColor()}`}>Feels like: {Math.round(cityData.main.feels_like)}°F</span>
                  </div>
                  <div className="flex items-center">
                    <Droplets size={20} className="mr-2 text-blue-400" />
                    <span className={`${getTextColor()}`}>Humidity: {cityData.main.humidity}%</span>
                  </div>
                  <div className="flex items-center">
                    <Wind size={20} className="mr-2 text-gray-400" />
                    <span className={`${getTextColor()}`}>Wind: {Math.round(cityData.wind.speed)} mph</span>
                  </div>
                  <div className="flex items-center">
                    <CloudRain size={20} className="mr-2 text-blue-500" />
                    <span className={`${getTextColor()}`}>Pressure: {cityData.main.pressure} hPa</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tab navigation */}
            <div className="flex mb-6">
            <Button
  title="5-Day Forecast"
  variant="tertiary"
  size="medium"
  isActive={activeTab === 'forecast'}
  onClick={() => setActiveTab('forecast')}
  leftIcon={<Calendar size={18} />}
  
/>
              
             
            </div>
            
            {/* Main content area */}
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 shadow-xl">
              {/* View toggle buttons */}
              <div className="flex justify-end mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 inline-flex">
                  <button
                    onClick={() => setViewMode('chart')} 
                    className={`p-2 rounded-md ${
                      viewMode === 'chart'
                        ? 'bg-white/20 backdrop-blur-md' 
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <BarChart2 size={18} className={getTextColor()} />
                  </button>
                  <button
                    onClick={() => setViewMode('table')} 
                    className={`p-2 rounded-md ${
                      viewMode === 'table'
                        ? 'bg-white/20 backdrop-blur-md' 
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <Table size={18} className={getTextColor()} />
                  </button>
                </div>
              </div>
              
              {/* Forecast content */}
              {activeTab === 'forecast' && (
                <div>
                  {processedForecastData ? (
                    <>
                      {viewMode === 'chart' ? (
                        <div className="mb-8">
                          <h3 className={`text-xl font-medium mb-4 ${getTextColor()}`}>Temperature Forecast</h3>
                          <div className="h-72 bg-white/10 backdrop-blur-md rounded-lg p-4">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={processedForecastData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                                <XAxis 
                                  dataKey="time" 
                                  stroke={getTextColor()} 
                                  tick={{ fill: getTextColor() }}
                                  tickFormatter={(value) => {
                                    // Extract only the hour part to avoid cluttering
                                    return value.split(':')[0];
                                  }}
                                />
                                <YAxis stroke={getTextColor()} tick={{ fill: getTextColor() }} />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '8px' }} 
                                  formatter={(value) => [`${value}°F`]} 
                                />
                                <Legend />
                                <Line 
                                  type="monotone" 
                                  dataKey="temp" 
                                  name="Temperature" 
                                  stroke="#ff7300" 
                                  activeDot={{ r: 8 }} 
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="feelsLike" 
                                  name="Feels Like" 
                                  stroke="#82ca9d" 
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                          
                          <h3 className={`text-xl font-medium my-4 ${getTextColor()}`}>Humidity & Precipitation</h3>
                          <div className="h-72 bg-white/10 backdrop-blur-md rounded-lg p-4">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={processedForecastData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                                <XAxis 
                                  dataKey="time" 
                                  stroke={getTextColor()} 
                                  tick={{ fill: getTextColor() }}
                                  tickFormatter={(value) => {
                                    return value.split(':')[0];
                                  }}
                                />
                                <YAxis stroke={getTextColor()} tick={{ fill: getTextColor() }} />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '8px' }} 
                                  formatter={(value, name) => {
                                    return [`${value}${name === 'Humidity' ? '%' : '% chance'}`];
                                  }} 
                                />
                                <Legend />
                                <Line 
                                  type="monotone" 
                                  dataKey="humidity" 
                                  name="Humidity" 
                                  stroke="#8884d8" 
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="precipitation" 
                                  name="Precipitation" 
                                  stroke="#4682b4" 
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {Object.keys(forecastByDate).map(date => (
                            <div key={date} className="mb-6">
                              <h3 className={`text-xl font-medium mb-4 ${getTextColor()}`}>{formatDate(date)}</h3>
                              <div className="overflow-x-auto">
                                <table className="w-full">
                                  <thead>
                                    <tr className="bg-white/10 backdrop-blur-sm">
                                      <th className={`p-3 text-left ${getTextColor()}`}>Time</th>
                                      <th className={`p-3 text-left ${getTextColor()}`}>Conditions</th>
                                      <th className={`p-3 text-left ${getTextColor()}`}>Temp</th>
                                      <th className={`p-3 text-left ${getTextColor()}`}>Feels Like</th>
                                      <th className={`p-3 text-left ${getTextColor()}`}>Humidity</th>
                                      <th className={`p-3 text-left ${getTextColor()}`}>Wind</th>
                                      <th className={`p-3 text-left ${getTextColor()}`}>Rain</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {forecastByDate[date].map((item, idx) => (
                                      <tr 
                                        key={idx} 
                                        className={`border-b border-white/10 ${
                                          idx % 2 === 0 ? 'bg-white/5' : 'bg-transparent'
                                        }`}
                                      >
                                        <td className={`p-3 ${getTextColor()}`}>{item.time}</td>
                                        <td className={`p-3 ${getTextColor()}`}>
                                          <div className="flex items-center">
                                            <img 
                                              src={getWeatherIconUrl(item.icon)} 
                                              alt={item.description} 
                                              className="w-10 h-10 mr-2"
                                            />
                                            <span className="capitalize">{item.description}</span>
                                          </div>
                                        </td>
                                        <td className={`p-3 ${getTextColor()}`}>{formatTemp(item.temp)}</td>
                                        <td className={`p-3 ${getTextColor()}`}>{formatTemp(item.feelsLike)}</td>
                                        <td className={`p-3 ${getTextColor()}`}>{item.humidity}%</td>
                                        <td className={`p-3 ${getTextColor()}`}>{item.windSpeed} mph</td>
                                        <td className={`p-3 ${getTextColor()}`}>{item.precipitation}%</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
              )}
              
              {/* History content */}
             
            </div>
          </>
        )}
      </div>
    </div>
    <Footer/>
    </div>
  );
}