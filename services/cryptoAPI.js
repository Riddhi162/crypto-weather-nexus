import axios from 'axios';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
const COINGECKO_API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

export const cryptoAPI = {
  getPrices: async (cryptoIds) => {
    try {
      const response = await axios.get(`${COINGECKO_BASE_URL}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          ids: cryptoIds.join(','),
          order: 'market_cap_desc',
          per_page: 100,
          page: 1,
          sparkline: false,
          price_change_percentage: '24h'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      throw error;
    }
  },

  getCryptoDetails: async (cryptoId) => {
    try {
      const response = await axios.get(`${COINGECKO_BASE_URL}/coins/${cryptoId}`, {
        params: {
          localization: false,
          tickers: true,
          market_data: true,
          community_data: false,
          developer_data: false
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching crypto details:', error);
      throw error;
    }
  },

  getHistoricalData: async (cryptoId, days) => {
    try {
      const response = await axios.get(`${COINGECKO_BASE_URL}/coins/${cryptoId}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days: days,
          x_cg_demo_api_key: COINGECKO_API_KEY ,

          interval: days > 30 ? 'daily' : 'hourly'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  }
};
