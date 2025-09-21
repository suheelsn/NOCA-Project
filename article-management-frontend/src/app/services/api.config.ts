import axios, { AxiosInstance } from 'axios';

// API base configuration
export const API_BASE_URL = 'http://localhost:5299/api';

// Create axios instance with default configuration
export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth tokens, logging, etc.
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token if available
        // const token = localStorage.getItem('authToken');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }

        console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors globally
apiClient.interceptors.response.use(
    (response) => {
        console.log(`Response received from ${response.config.url}:`, response.status);
        return response;
    },
    (error) => {
        console.error('Response error:', error);

        // Handle common error scenarios
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;
            console.error(`API Error ${status}:`, data);
        } else if (error.request) {
            // Request was made but no response received
            console.error('Network error - no response received');
        } else {
            // Something else happened
            console.error('Request setup error:', error.message);
        }

        return Promise.reject(error);
    }
);