import axios from 'axios';

// Centralized Fetch Function (for GET requests)
export const fetchData = async (type, params = {}) => {
    try {
        // Send the type and other parameters (like page) dynamically
        const response = await axios.get('/backend/backend', {
            params: { type, ...params }, // Send type and additional parameters
        });

        if (response.status !== 200) {
            throw new Error(`Failed to fetch data for type: ${type}`);
        }
        return response.data; // Return the data
    } catch (error) {
        throw new Error(`Error while fetching data for type: ${type}. ${error.message}`);
    }
};

// Centralized Post Function (for POST requests)
export const postData = async (type, payload) => {
    try {
        const response = await axios.post('/backend/backend', { type, payload });

        if (response.status !== 200) {
            throw new Error(`Failed to post data for type: ${type}`);
        }

        return response.data; // Return the data
    } catch (error) {
        throw new Error(`Error while posting data for type: ${type}. ${error.message}`);
    }
};
