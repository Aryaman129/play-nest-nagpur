import { createClient } from '@supabase/supabase-js';
import { ApiResponse, ApiError } from '@/types';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Legacy API client wrapper for backward compatibility
export class ApiClient {
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    console.log(`API: GET ${endpoint}`);
    return {
      data: {} as T,
      success: true,
      timestamp: new Date(),
    };
  }
  
  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    console.log(`API: POST ${endpoint}`, data);
    return {
      data: data as T,
      success: true,
      timestamp: new Date(),
    };
  }
  
  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    console.log(`API: PUT ${endpoint}`, data);
    return {
      data: data as T,
      success: true,
      timestamp: new Date(),
    };
  }
  
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    console.log(`API: DELETE ${endpoint}`);
    return {
      data: {} as T,
      success: true,
      timestamp: new Date(),
    };
  }
}

export const apiClient = new ApiClient();