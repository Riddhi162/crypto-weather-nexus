import axios from 'axios';

const NEWSDATA_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const BASE_URL = 'https://newsdata.io/api/1/news';

export const newsAPI = {
  getCryptoNews: async (limit = 5, nextPageToken = null) => {
    try {
      const params = {
        apikey: NEWSDATA_API_KEY,
        q: 'cryptocurrency OR bitcoin OR blockchain',
        language: 'en'
      };
      
      if (nextPageToken) {
        params.page = nextPageToken;
      }
      
      const response = await axios.get(BASE_URL, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching crypto news:', error);
      throw error;
    }
  }
};