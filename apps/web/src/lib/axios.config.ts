import axios from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL_3;

export const api = axios.create({
    baseURL: baseUrl
  });