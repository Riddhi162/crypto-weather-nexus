import axios from 'axios';

const OPENWEATHER_API_KEY = '50e95face4b23ad03a11a1f1a6ed82b5'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const weatherAPI = {
  // Get current weather for a city
  getCurrentWeather: async (city) => {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: city,
          units: 'imperial', // For Fahrenheit
          appid: OPENWEATHER_API_KEY
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw error;
    }
  },

  // Get 5-day forecast for a city
  getForecast: async (city) => {
    try {
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          q: city,
          units: 'imperial',
          appid: OPENWEATHER_API_KEY
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw error;
    }
  },

  // Get weather history using One Call API (requires coordinates)
  getWeatherHistory: async (lat, lon, start, end) => {
    try {
      const response = await axios.get(`${BASE_URL}/onecall/timemachine`, {
        params: {
          lat,
          lon,
          dt: start, // UNIX timestamp
          appid: OPENWEATHER_API_KEY,
          units: 'imperial'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather history:', error);
      throw error;
    }
  }
};
