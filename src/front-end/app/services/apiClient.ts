// src/front-end/app/services/apiClient.ts
import axios from 'axios';
import { Config } from './config';
// *** THAY ĐỔI URL NÀY CHO ĐÚNG VỚI BACKEND CỦA BẠN ***
const API_BASE_URL = Config.API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để tự động đính kèm token (nếu có)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;