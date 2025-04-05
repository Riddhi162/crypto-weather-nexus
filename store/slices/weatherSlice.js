import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { weatherAPI } from '../../services/weatherAPI';

export const fetchCityWeather = createAsyncThunk(
  'weather/fetchCityWeather',
  async (city, { rejectWithValue }) => {
    try {
      const data = await weatherAPI.getCurrentWeather(city);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching weather data');
    }
  }
);

export const fetchCityForecast = createAsyncThunk(
  'weather/fetchCityForecast',
  async (city, { rejectWithValue }) => {
    try {
      const data = await weatherAPI.getForecast(city);
      return { city, data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching forecast data');
    }
  }
);

export const fetchWeatherHistory = createAsyncThunk(
  'weather/fetchWeatherHistory',
  async ({ lat, lon, days = 7 }, { rejectWithValue }) => {
    try {
      const endDate = Math.floor(Date.now() / 1000);
      const data = [];
      
      const daysToFetch = Math.min(days, 5);
      for (let i = 1; i <= daysToFetch; i++) {
        const timestamp = endDate - (i * 86400);
        const dayData = await weatherAPI.getWeatherHistory(lat, lon, timestamp);
        data.push(dayData);
      }
      
      return { lat, lon, data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching weather history');
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    currentWeather: {},
    forecasts: {},
    history: {},
    alerts: [],
    loading: false,
    error: null,
  },
  reducers: {
    addWeatherAlert: (state, action) => {
      state.alerts.unshift(action.payload);
      if (state.alerts.length > 10) {
        state.alerts.pop();
      }
    },
    clearWeatherAlerts: (state) => {
      state.alerts = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCityWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCityWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWeather[action.payload.name] = {
          ...action.payload,
          timestamp: Date.now(),
        };
      })
      .addCase(fetchCityWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch weather data';
      })
      
      .addCase(fetchCityForecast.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCityForecast.fulfilled, (state, action) => {
        state.loading = false;
        state.forecasts[action.payload.city] = {
          data: action.payload.data,
          timestamp: Date.now(),
        };
      })
      .addCase(fetchCityForecast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch forecast data';
      })
      
      .addCase(fetchWeatherHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherHistory.fulfilled, (state, action) => {
        state.loading = false;
        const key = `${action.payload.lat},${action.payload.lon}`;
        state.history[key] = {
          data: action.payload.data,
          timestamp: Date.now(),
        };
      })
      .addCase(fetchWeatherHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch weather history';
      });
  },
});

export const { addWeatherAlert, clearWeatherAlerts } = weatherSlice.actions;
export default weatherSlice.reducer;
