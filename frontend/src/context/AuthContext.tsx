import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { authApi } from '../utils/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}



const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing token in localStorage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchCurrentUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      setIsLoading(true);
      const response: any = await authApi.getMe(authToken);
      
      console.log('Get current user response:', response);
      
      // Check if the response has the expected structure
      // Based on the backend controller, the structure should be:
      // { success: true, data: { id, name, email, createdAt } }
      if (response && response.success && response.data) {
        setUser(response.data);
      } else {
        throw new Error('Invalid user data response');
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
      // If token is invalid, clear it
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Make the login request
      const response: any = await authApi.login(email, password);
      
      // Log the response for debugging
      console.log('Login response:', response);
      
      // Check if the response has the expected structure
      // Based on the backend controller, the structure should be:
      // { success: true, data: { id, name, email }, token }
      if (response && response.success && response.data && response.token) {
        const userData = response.data;
        const authToken = response.token;
        
        // Save token to localStorage
        localStorage.setItem('token', authToken);
        
        // Update state
        setUser(userData);
        setToken(authToken);
        
        console.log('Authentication successful, user:', userData);
      } else {
        // Handle unexpected response structure
        console.error('Unexpected login response structure:', response);
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please check your credentials.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Make the register request
      const response: any = await authApi.register(name, email, password);
      
      console.log('Register response:', response);
      
      // Check if the response has the expected structure
      // Based on the backend controller, the structure should be:
      // { success: true, data: { id, name, email, createdAt }, token }
      if (response && response.success && response.data && response.token) {
        const userData = response.data;
        const authToken = response.token;
        
        // Save token to localStorage
        localStorage.setItem('token', authToken);
        
        // Update state
        setUser(userData);
        setToken(authToken);
        
        console.log('Registration successful, user:', userData);
      } else {
        // If direct login from registration response fails, try normal login
        await login(email, password);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      if (token) {
        await authApi.logout(token);
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Always clear local state, even if API call fails
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
