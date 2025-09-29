import { User, AuthState, ApiResponse } from '@/types';
import { supabase } from './api';

// Authentication service using Supabase Auth
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
   * Sign in user with email and password
   */
  async signIn(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw new Error(error.message);
      
      // Get user data from our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (userError || !userData) {
        throw new Error('User profile not found');
      }
      
      this.currentUser = userData as User;
      
      return {
        data: {
          user: this.currentUser,
          token: data.session?.access_token || '',
        },
        success: true,
        timestamp: new Date(),
      };
    } catch (error: any) {
      throw {
        code: 'AUTH_FAILED',
        message: error.message || 'Invalid email or password',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Register new user account
   */
  async signUp(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role?: 'customer' | 'owner';
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });
      
      if (authError) throw new Error(authError.message);
      
      if (!authData.user) throw new Error('Failed to create user account');
      
      // Create user profile in our users table
      const newUser = {
        id: authData.user.id,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        role: userData.role || 'customer',
        verified: false,
      };
      
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .insert([newUser])
        .select()
        .single();
      
      if (profileError) throw new Error(profileError.message);
      
      this.currentUser = userProfile as User;
      
      return {
        data: {
          user: this.currentUser,
          token: authData.session?.access_token || '',
        },
        success: true,
        timestamp: new Date(),
      };
    } catch (error: any) {
      throw {
        code: 'SIGNUP_FAILED',
        message: error.message || 'Failed to create account',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<void> {
    await supabase.auth.signOut();
    this.currentUser = null;
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (userData) {
      this.currentUser = userData as User;
    }
    
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  }

  /**
   * Check user role
   */
  async hasRole(role: 'customer' | 'owner' | 'admin'): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * Forgot password
   */
  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw new Error(error.message);
      
      return {
        data: { message: 'Password reset link sent to your email' },
        success: true,
        timestamp: new Date(),
      };
    } catch (error: any) {
      throw {
        code: 'PASSWORD_RESET_FAILED',
        message: error.message || 'Failed to send password reset email',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Reset password
   */
  async resetPassword(newPassword: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw new Error(error.message);
      
      return {
        data: { message: 'Password reset successfully' },
        success: true,
        timestamp: new Date(),
      };
    } catch (error: any) {
      throw {
        code: 'PASSWORD_UPDATE_FAILED',
        message: error.message || 'Failed to update password',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Verify email
   */
  async verifyEmail(): Promise<ApiResponse<{ user: User }>> {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('User not found');
      
      const { error } = await supabase
        .from('users')
        .update({ verified: true })
        .eq('id', user.id);
      
      if (error) throw new Error(error.message);
      
      user.verified = true;
      this.currentUser = user;
      
      return {
        data: { user },
        success: true,
        timestamp: new Date(),
      };
    } catch (error: any) {
      throw {
        code: 'EMAIL_VERIFICATION_FAILED',
        message: error.message || 'Failed to verify email',
        timestamp: new Date(),
      };
    }
  }
}

export const authService = AuthService.getInstance();