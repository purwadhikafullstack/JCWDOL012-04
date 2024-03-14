import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

//create
export const createData = async (
  endpoint: string,
  data: any,
  contentType: string,
) => {
  try {
    const response = await api.post(endpoint, data, {
      headers: {
        'Content-Type': contentType,
      },
    });
    return response;
  } catch (error) {
    console.error('Error creating data:', error);
    throw error;
  }
};

//read
export const fetchData = async (endpoint: string) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

//update
export const updateData = async (
  endpoint: string,
  data: any,
  contentType: string,
) => {
  try {
    const response = await api.patch(endpoint, data, {
      headers: {
        'Content-Type': contentType,
      },
    });
    return response;
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
};

//archive
export const archiveData = async (endpoint: string) => {
  try {
    const response = await api.put(endpoint, {
      archived: true,
    });
    return response;
  } catch (error) {
    console.error('Error archiving data:', error);
    throw error;
  }
};

//delete
export const deleteData = async (endpoint: string) => {
  try {
    const response = await api.delete(endpoint);
    return response;
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
};
