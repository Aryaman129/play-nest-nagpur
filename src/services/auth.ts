import { User, AuthState, ApiResponse } from '@/types';
import { apiClient } from './api';
import { MOCK_USERS } from '@/utils/mockData';

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Mock sign in
   */
  async signIn(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      await apiClient.post('/auth/signin', { email, password });
      
      // Mock authentication logic
      const user = MOCK_USERS.find(u => u.email === email);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      this.currentUser = user;
      localStorage.setItem('auth_token', 'mock_token_' + user.id);
      localStorage.setItem('user', JSON.stringify(user));
      
      return {
        data: {
          user,
          token: 'mock_token_' + user.id,
        },
        success: true,
        timestamp: new Date(),
      };
    } catch (error) {
      throw {
        code: 'AUTH_FAILED',
        message: 'Invalid email or password',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Mock sign up
   */
  async signUp(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role?: 'customer' | 'owner';
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      await apiClient.post('/auth/signup', userData);
      
      const newUser: User = {
        id: 'user_' + Date.now(),
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        role: userData.role || 'customer',
        verified: false,
        createdAt: new Date(),
      };
      
      // Add to mock users (in real app, this would be server-side)
      MOCK_USERS.push(newUser);
      
      this.currentUser = newUser;
      localStorage.setItem('auth_token', 'mock_token_' + newUser.id);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return {
        data: {
          user: newUser,
          token: 'mock_token_' + newUser.id,
        },
        success: true,
        timestamp: new Date(),
      };
    } catch (error) {
      throw {
        code: 'SIGNUP_FAILED',
        message: 'Failed to create account',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }
    
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
      return this.currentUser;
    }
    
    return null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token && !!this.getCurrentUser();
  }

  /**
   * Check user role
   */
  hasRole(role: 'customer' | 'owner' | 'admin'): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * Mock forgot password
   */
  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    await apiClient.post('/auth/forgot-password', { email });
    
    return {
      data: { message: 'Password reset link sent to your email' },
      success: true,
      timestamp: new Date(),
    };
  }

  /**
   * Mock reset password
   */
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    await apiClient.post('/auth/reset-password', { token, password: newPassword });
    
    return {
      data: { message: 'Password reset successfully' },
      success: true,
      timestamp: new Date(),
    };
  }

  /**
   * Mock verify email
   */
  async verifyEmail(token: string): Promise<ApiResponse<{ user: User }>> {
    await apiClient.post('/auth/verify-email', { token });
    
    const user = this.getCurrentUser();
    if (user) {
      user.verified = true;
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return {
      data: { user: user! },
      success: true,
      timestamp: new Date(),
    };
  }
}

export const authService = AuthService.getInstance();