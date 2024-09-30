const axios = require('axios');

const handler = async function (event, context) {
    const BASE_API_URL = 'http://stageapi.monkcommerce.app/task/products/search';
    
    const { search, page, limit } = event.queryStringParameters; // Capture query parameters from frontend

    try {
        // Make a request to the external API
        const response = await axios.get(BASE_API_URL, {
            headers: {
                accept: 'application/json',
                'x-api-key': '72njgfa948d9aS7gs5', // Include your API key
            },
            params: {
                search: search || '', // Pass the search term from frontend
                page: page || 1, // Pass page from frontend, default to 1
                limit: limit || 10, // Default limit is 10
            },
        });

        // Return the fetched data in the response
        return {
            statusCode: 200,
            body: JSON.stringify(response.data),
        };
    } catch (error) {
        // Handle any error that occurs during the fetch
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch products' }),
        };
    }
};

module.exports = { handler }