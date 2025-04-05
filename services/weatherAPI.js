import axios from 'axios';

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const makeWeatherRequest = async (endpoint, params) => {
  try {
    const response = await axios.get(`${BASE_URL}/${endpoint}`, {
      params: {
        ...params,
        units: 'imperial',
        appid: OPENWEATHER_API_KEY
      },
      timeout: 5000
    });
    return response.data;
  } catch (error) {
    console.error(`Weather API Error (${endpoint}):`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || `Failed to fetch ${endpoint} data`);
  }
};

export const weatherAPI = {
  getCurrentWeather: async (city) => {
    return makeWeatherRequest('weather', { q: city });
  },

  getForecast: async (city) => {
    return makeWeatherRequest('forecast', { 
      q: city,
      cnt: 40
    });
  },

  getWeatherHistory: async (lat, lon, timestamp) => {
    return makeWeatherRequest('onecall/timemachine', {
      lat,
      lon,
      dt: Math.floor(timestamp / 1000)
    });
  }
};