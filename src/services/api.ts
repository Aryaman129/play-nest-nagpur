import { ApiResponse, ApiError } from '@/types';

// Mock API configuration
const API_CONFIG = {
  baseURL: 'https://api.playnest.com', // Mock URL
  timeout: 5000,
  retries: 3,
};

// Simulate network delay for realism
const simulateDelay = (min = 300, max = 800) => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Simulate API errors occasionally
const simulateError = (errorRate = 0.1): boolean => {
  return Math.random() < errorRate;
};

// Mock API wrapper
export class MockApiClient {
  private async makeRequest<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      data?: any;
      errorRate?: number;
    } = {}
  ): Promise<ApiResponse<T>> {
    const { method = 'GET', data, errorRate = 0.05 } = options;
    
    // Simulate network delay
    await simulateDelay();
    
    // Simulate occasional errors
    if (simulateError(errorRate)) {
      const error: ApiError = {
        code: 'NETWORK_ERROR',
        message: 'Network request failed',
        timestamp: new Date(),
      };
      throw error;
    }
    
    console.log(`Mock API: ${method} ${endpoint}`, data);
    
    return {
      data: data as T,
      success: true,
      timestamp: new Date(),
    };
  }
  
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET' });
  }
  
  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'POST', data });
  }
  
  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'PUT', data });
  }
  
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new MockApiClient();