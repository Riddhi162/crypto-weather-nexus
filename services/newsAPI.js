// import axios from 'axios';

// const NEWSDATA_API_KEY = 'YOUR_NEWSDATA_API_KEY'; // Replace with your actual API key
// const BASE_URL = 'https://newsdata.io/api/1/news';

// export const newsAPI = {
//   // Get crypto-related news
//   getCryptoNews: async (page = 0) => {
//     try {
//       const response = await axios.get(BASE_URL, {
//         params: {
//           apikey: NEWSDATA_API_KEY,
//           q: 'cryptocurrency OR bitcoin OR blockchain',
//           language: 'en',
//           page
//         }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching crypto news:', error);
//       throw error;
//     }
//   }
// };
