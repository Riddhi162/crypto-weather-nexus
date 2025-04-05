import axios from 'axios';

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Helper function for API requests
const makeWeatherRequest = async (endpoint, params) => {
  try {
    const response = await axios.get(`${BASE_URL}/${endpoint}`, {
      params: {
        ...params,
        units: 'imperial',
        appid: OPENWEATHER_API_KEY
      },
      timeout: 5000 // 5 second timeout
    });
    return response.data;
  } catch (error) {
    console.error(`Weather API Error (${endpoint}):`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || `Failed to fetch ${endpoint} data`);
  }
};

export const weatherAPI = {
  // Get current weather for a city
  getCurrentWeather: async (city) => {
    return makeWeatherRequest('weather', { q: city });
  },

  // Get 5-day forecast for a city (3-hour intervals)
  getForecast: async (city) => {
    return makeWeatherRequest('forecast', { 
      q: city,
      cnt: 40 // About 5 days of 3-hour intervals
    });
  },

  // Get historical weather (requires coordinates and timestamp)
  getWeatherHistory: async (lat, lon, timestamp) => {
    return makeWeatherRequest('onecall/timemachine', {
      lat,
      lon,
      dt: Math.floor(timestamp / 1000) // Convert to UNIX timestamp
    });
  }
};