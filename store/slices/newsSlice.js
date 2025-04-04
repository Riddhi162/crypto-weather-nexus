import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { newsAPI } from '../../services/newsAPI';

export const fetchCryptoNews = createAsyncThunk(
  'news/fetchCryptoNews',
  async (page = 0, { rejectWithValue }) => {
    try {
      const data = await newsAPI.getCryptoNews(page);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching crypto news');
    }
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    articles: [],
    nextPage: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptoNews.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload.page === 0 
          ? action.payload.results 
          : [...state.articles, ...action.payload.results];
        state.nextPage = action.payload.nextPage;
      })
      .addCase(fetchCryptoNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch news';
      });
  },
});

export default newsSlice.reducer;
