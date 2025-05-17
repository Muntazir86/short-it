import { User } from '../types';

// Using environment variables for API URL
const API_URL = process.env.REACT_APP_API_URL || '/api/v1';

// Helper function for making API requests
async function fetchApi<T>(
  endpoint: string, 
  method: string = 'GET', 
  data?: any, 
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Only add Authorization header if token is provided and is a non-empty string
  if (token && typeof token === 'string' && token.trim() !== '') {
    console.log('Adding Authorization header with token');
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.log('No valid token provided, request will be unauthenticated');
  }

  const config: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    console.log(`API Request: ${method} ${API_URL}${endpoint}`, { data, hasToken: !!token });
    
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const result = await response.json();
    
    console.log(`API Response: ${method} ${endpoint}`, { status: response.status, result });

    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong');
    }

    return result;
  } catch (error) {
    console.error(`API Error: ${method} ${endpoint}`, error);
    throw error;
  }
}

// Auth API
export const authApi = {
  register: async (name: string, email: string, password: string) => {
    // Based on the backend controller, the response structure is:
    // { success: true, data: { id, name, email, createdAt }, token }
    return fetchApi<{ success: boolean; data: User; token: string }>('/auth/register', 'POST', { name, email, password });
  },
  
  login: async (email: string, password: string) => {
    // Based on the backend controller, the response structure is:
    // { success: true, data: { id, name, email }, token }
    return fetchApi<{ success: boolean; data: User; token: string }>('/auth/login', 'POST', { email, password });
  },
  
  logout: async (token: string) => {
    return fetchApi<{ success: boolean }>('/auth/logout', 'POST', {}, token);
  },
  
  getMe: async (token: string) => {
    // Based on the backend controller, the response structure is:
    // { success: true, data: { id, name, email, createdAt } }
    return fetchApi<{ success: boolean; data: User }>('/auth/me', 'GET', undefined, token);
  }
};

// URL API
export const urlApi = {
  createUrl: async (originalUrl: string, token?: string, customCode?: string, isPrivate?: boolean) => {
    const data: any = { originalUrl };
    
    if (customCode) data.customCode = customCode;
    if (isPrivate !== undefined) data.isPrivate = isPrivate;
    
    return fetchApi('/urls', 'POST', data, token);
  },
  
  getUrls: async (token: string, page: number = 1, limit: number = 10) => {
    return fetchApi(`/urls?page=${page}&limit=${limit}`, 'GET', undefined, token);
  },
  
  getUrlByShortCode: async (shortCode: string, token?: string) => {
    // Use the proper endpoint for getting URL details
    // This should be different from the redirect endpoint
    return fetchApi(`/urls/details/${shortCode}`, 'GET', undefined, token);
  },
  
  updateUrl: async (id: string, data: any, token: string) => {
    return fetchApi(`/urls/${id}`, 'PATCH', data, token);
  },
  
  deleteUrl: async (id: string, token: string) => {
    return fetchApi(`/urls/${id}`, 'DELETE', undefined, token);
  }
};

// Analytics API
export const analyticsApi = {
  getUrlAnalytics: async (id: string, token: string) => {
    return fetchApi(`/analytics/urls/${id}`, 'GET', undefined, token);
  },
  
  getDashboard: async (token: string) => {
    return fetchApi('/analytics/dashboard', 'GET', undefined, token);
  }
};
