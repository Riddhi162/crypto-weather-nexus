import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cryptoAPI } from '../../services/cryptoAPI';

export const fetchCryptoPrices = createAsyncThunk(
  'crypto/fetchCryptoPrices',
  async (cryptoIds, { rejectWithValue }) => {
    try {
      const data = await cryptoAPI.getPrices(cryptoIds);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching crypto prices');
    }
  }
);

export const fetchCryptoDetails = createAsyncThunk(
  'crypto/fetchCryptoDetails',
  async (cryptoId, { rejectWithValue }) => {
    try {
      const data = await cryptoAPI.getCryptoDetails(cryptoId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching crypto details');
    }
  }
);

export const fetchCryptoHistory = createAsyncThunk(
  'crypto/fetchCryptoHistory',
  async ({ cryptoId, days }, { rejectWithValue }) => {
    try {
      const data = await cryptoAPI.getHistoricalData(cryptoId, days);
      return { cryptoId, days, data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching crypto history');
    }
  }
);

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState: {
    prices: [],
    details: {},
    history: {},
    liveData: {},
    loading: false,
    error: null,
  },
  reducers: {
    setWebSocketData: (state, action) => {
      state.liveData = {
        ...state.liveData,
        ...action.payload,
        timestamp: Date.now()
      };
      
      state.prices = state.prices.map(crypto => {
        if (action.payload[crypto.id]) {
          return {
            ...crypto,
            current_price: parseFloat(action.payload[crypto.id]),
            price_change_24h: crypto.current_price 
              ? parseFloat(action.payload[crypto.id]) - crypto.current_price 
              : 0
          };
        }
        return crypto;
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoPrices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptoPrices.fulfilled, (state, action) => {
        state.loading = false;
        state.prices = action.payload;
      })
      .addCase(fetchCryptoPrices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch crypto prices';
      })
      
      .addCase(fetchCryptoDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptoDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details[action.payload.id] = {
          data: action.payload,
          timestamp: Date.now()
        };
      })
      .addCase(fetchCryptoDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch crypto details';
      })
      
      .addCase(fetchCryptoHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptoHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history[`${action.payload.cryptoId}-${action.payload.days}`] = {
          data: action.payload.data,
          timestamp: Date.now()
        };
      })
      .addCase(fetchCryptoHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch crypto history';
      });
  },
});

export const { setWebSocketData } = cryptoSlice.actions;
export default cryptoSlice.reducer;
