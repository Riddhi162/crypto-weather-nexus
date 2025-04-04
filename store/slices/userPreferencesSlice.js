import { createSlice } from '@reduxjs/toolkit';

const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState: {
    favoriteCities: ['New York', 'London', 'Tokyo'],
    favoriteCryptos: ['bitcoin', 'ethereum', 'solana'],
    settings: {
      temperatureUnit: 'F', // F or C
      autoRefresh: true,
      refreshInterval: 60000, // 1 minute
      theme: 'light',
    }
  },
  reducers: {
    addFavoriteCity: (state, action) => {
      if (!state.favoriteCities.includes(action.payload)) {
        state.favoriteCities.push(action.payload);
      }
    },
    removeFavoriteCity: (state, action) => {
      state.favoriteCities = state.favoriteCities.filter(city => city !== action.payload);
    },
    addFavoriteCrypto: (state, action) => {
      if (!state.favoriteCryptos.includes(action.payload)) {
        state.favoriteCryptos.push(action.payload);
      }
    },
    removeFavoriteCrypto: (state, action) => {
      state.favoriteCryptos = state.favoriteCryptos.filter(crypto => crypto !== action.payload);
    },
    updateSettings: (state, action) => {
      state.settings = {
        ...state.settings,
        ...action.payload
      };
    }
  }
});

export const {
  addFavoriteCity,
  removeFavoriteCity,
  addFavoriteCrypto,
  removeFavoriteCrypto,
  updateSettings
} = userPreferencesSlice.actions;

export default userPreferencesSlice.reducer;
