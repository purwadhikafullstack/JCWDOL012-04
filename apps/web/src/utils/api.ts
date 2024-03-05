import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
});

export const fetchData = async (endpoint: string) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
