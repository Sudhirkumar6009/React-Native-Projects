const API_KEY = 'eac6d4f56e8f4a2b99aafa3919860ecc'; //eac6d4f56e8f4a2b99aafa3919860ecc, 433fbf092245403bb240919fd6a10340, 38dc0a24dec84583a3b9e2c3a8be489d, 553ae256ad1d4dc5a411a7c7aa2159d0, 6b44f9312ee74908a91d37d810d55ac4
const BASE_URL = 'https://api.worldnewsapi.com';

const NetworkService = {
  fetchNews: async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/search-news?source-countries=us&language=en&api-key=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.news && Array.isArray(data.news)) {
        return data.news;
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('API Error fetching news:', error.message);
      return []; 
    }
  },

  fetchHeadlines: async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/top-news?source-country=us&language=en&api-key=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); 
      if (data.top_news && data.top_news[0].news && Array.isArray(data.top_news[0].news)) {
        return data.top_news[0].news;
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('API Error fetching headlines:', error.message);
      return [];
    }
  },
};

export default NetworkService;
