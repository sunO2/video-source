// API functions for fetching movie data
const API_BASE_URL = 'https://5bt0.com/prod/api/v1';
const APP_ID = '83768d9ad4';
const IDENTITY = '23734adac0301bccdcb107c4aa21f96c';

/**
 * Fetches video list based on search query.
 * @param {string} searchQuery - The search term.
 * @param {number} page - The page number.
 * @param {number} limit - The number of items per page.
 * @returns {Promise<object>} - The API response data.
 */
async function searchVideos(searchQuery, page = 1, limit = 24) {
    const url = `${API_BASE_URL}/getVideoList?sb=${encodeURIComponent(searchQuery)}&page=${page}&limit=${limit}&app_id=${APP_ID}&identity=${IDENTITY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.data.data; // Return the actual video data array
    } catch (error) {
        console.error('Error fetching search results:', error);
        return [];
    }
}

/**
 * Fetches recommended video list based on category.
 * @param {number} categoryId - The category ID (1:电影, 2:电视剧, 3:近日热门, 4:本周热门, 5:本月热门).
 * @returns {Promise<object>} - The API response data.
 */
async function getRecommendedVideos(categoryId) {
    const url = `${API_BASE_URL}/getVideoList?sc=${categoryId}&app_id=${APP_ID}&identity=${IDENTITY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.data.data; // Return the actual video data array
    } catch (error) {
        console.error('Error fetching recommended videos:', error);
        return [];
    }
}

async function getVideoDetail(id) {
    const url = `${API_BASE_URL}/getVideoDetail?id=${id}&app_id=${APP_ID}&identity=${IDENTITY}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data; // Return the actual video data array
    } catch (error) {
        console.error('Error fetching recommended videos:', error);
        return {};
    }
}

export { searchVideos, getRecommendedVideos, getVideoDetail };
