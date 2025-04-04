// store/slices/newsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { newsAPI } from '../../services/newsAPI';

export const fetchCryptoNews = createAsyncThunk(
  'news/fetchCryptoNews',
  async ({ limit, nextPageToken }, { rejectWithValue }) => {
    try {
      const data = await newsAPI.getCryptoNews(limit, nextPageToken);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    articles: [],
    loading: false,
    error: null,
    lastFetched: null,
    nextPage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCryptoNews.fulfilled, (state, action) => {
        const { results, nextPage } = action.payload;
        
        // If this is a subsequent page request, append the articles
        if (action.meta.arg.nextPageToken) {
          state.articles = [...state.articles, ...results];
        } else {
          // Otherwise it's a fresh request, replace all articles
          state.articles = results;
        }
        
        state.loading = false;
        state.lastFetched = new Date().toISOString();
        state.nextPage = nextPage || null;
      })
      .addCase(fetchCryptoNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default newsSlice.reducer;