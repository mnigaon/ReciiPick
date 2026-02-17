import axios from 'axios';

const API_BASE_URL = '/api';

export const generateRecipe = async (ingredients, imageBase64) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/recipe`, {
            ingredients,
            image: imageBase64
        });
        return response.data.text;
    } catch (error) {
        console.error('Error in generateRecipe:', error);
        throw error;
    }
};
