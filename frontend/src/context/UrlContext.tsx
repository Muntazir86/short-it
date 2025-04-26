import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { urlApi } from '../utils/api';
import { Url, PaginatedResponse } from '../types';
import { useAuth } from './AuthContext';

interface UrlContextType {
  urls: Url[];
  isLoading: boolean;
  error: string | null;
  totalUrls: number;
  currentPage: number;
  totalPages: number;
  addUrl: (originalUrl: string, customCode?: string, isPrivate?: boolean) => Promise<Url>;
  deleteUrl: (id: string) => Promise<void>;
  getUrlDetails: (shortCode: string) => Promise<Url | null>;
  fetchUrls: (page?: number, limit?: number) => Promise<void>;
  clearError: () => void;
  triggerFetch: () => void; // New function to trigger data fetching
}



const UrlContext = createContext<UrlContextType | undefined>(undefined);

export const UrlProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [urls, setUrls] = useState<Url[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalUrls, setTotalUrls] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  // Only fetch URLs when explicitly requested via shouldFetch state
  // This prevents automatic API calls on every render
  useEffect(() => {
    if (shouldFetch && isAuthenticated && token && !isLoading && !hasFetched) {
      console.log('Triggering URL fetch based on shouldFetch state');
      fetchUrls(1);
      setShouldFetch(false);
      setHasFetched(true);
    }
  }, [shouldFetch, isAuthenticated, token, isLoading, hasFetched]);

  const fetchUrls = async (page: number = 1, limit: number = 10) => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching URLs with token:', token ? 'Token exists' : 'No token');
      const response: any = await urlApi.getUrls(token, page, limit);
      console.log('URL fetch response:', response);
      
      // Check if the response has the expected structure
      if (response && response.success && response.data) {
        // Based on the backend controller, the response structure is:
        // { success: true, data: { urls: [...], pagination: { total, pages, page, limit } } }
        console.log('Processing URL response data:', response.data);
        
        if (response.data.urls && Array.isArray(response.data.urls)) {
          // This matches the exact structure from the backend controller
          setUrls(response.data.urls);
          
          // Get pagination data if available
          if (response.data.pagination) {
            setTotalUrls(response.data.pagination.total || response.data.urls.length);
            setTotalPages(response.data.pagination.pages || 1);
            setCurrentPage(response.data.pagination.page || 1);
          } else {
            // Fallback if pagination data is not available
            setTotalUrls(response.data.urls.length);
            setCurrentPage(1);
            setTotalPages(1);
          }
          console.log('Successfully processed URLs:', response.data.urls.length);
        } else if (Array.isArray(response.data)) {
          // Handle case where data is an array directly
          setUrls(response.data);
          setTotalUrls(response.data.length);
          setCurrentPage(1);
          setTotalPages(1);
          console.log('Processed array of URLs:', response.data.length);
        } else if (response.data.items && Array.isArray(response.data.items)) {
          // Handle alternative pagination structure
          setUrls(response.data.items);
          setTotalUrls(response.data.total || response.data.items.length);
          setCurrentPage(response.data.page || 1);
          setTotalPages(response.data.totalPages || 1);
          console.log('Processed paginated URLs:', response.data.items.length);
        } else {
          // Fallback for unexpected structure
          console.error('Unexpected URL response structure:', response.data);
          setUrls([]);
          setTotalUrls(0);
          setCurrentPage(1);
          setTotalPages(1);
        }
      } else {
        // Handle empty or invalid response
        setUrls([]);
        setTotalUrls(0);
        setCurrentPage(1);
        setTotalPages(1);
        console.error('Invalid URL response:', response);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch URLs');
      console.error('Error fetching URLs:', err);
      // Set empty arrays on error
      setUrls([]);
      setTotalUrls(0);
    } finally {
      setIsLoading(false);
    }
  };

  const addUrl = async (originalUrl: string, customCode?: string, isPrivate?: boolean): Promise<Url> => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Creating URL:', { originalUrl, customCode, isPrivate, hasToken: !!token });
      
      // Make sure we're passing the token correctly for authenticated users
      // The token should not be undefined for authenticated users
      if (isAuthenticated && !token) {
        console.error('User is authenticated but token is missing');
        throw new Error('Authentication token is missing');
      }
      
      // Convert null to undefined to satisfy TypeScript
      const authToken = token || undefined;
      const response: any = await urlApi.createUrl(originalUrl, authToken, customCode, isPrivate);
      console.log('URL creation response:', response);
      
      // Check if the response has the expected structure
      if (response && response.success && response.data) {
        const newUrl = response.data as Url;
        
        // If authenticated, add to the list
        if (isAuthenticated) {
          setUrls((prevUrls: Url[]) => [newUrl, ...(prevUrls || [])]);
          setTotalUrls((prev: number) => prev + 1);
        }
        
        return newUrl;
      } else {
        console.error('Invalid URL creation response:', response);
        throw new Error('Failed to create shortened URL');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create shortened URL');
      console.error('Error creating URL:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUrl = async (id: string): Promise<void> => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Deleting URL with ID:', id);
      const response: any = await urlApi.deleteUrl(id, token);
      console.log('URL deletion response:', response);
      
      // Check if the response indicates success
      if (response && response.success) {
        // Update the URLs list by filtering out the deleted URL
        setUrls((prevUrls: Url[]) => {
          if (!prevUrls) return [];
          return prevUrls.filter((url: Url) => url.id !== id);
        });
        
        // Update the total count
        setTotalUrls((prev: number) => Math.max(0, prev - 1));
        
        console.log('URL deleted successfully');
      } else {
        console.error('Failed to delete URL, unexpected response:', response);
        throw new Error('Failed to delete URL');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete URL');
      console.error('Error deleting URL:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getUrlDetails = async (shortCode: string): Promise<Url | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching URL details for shortCode:', shortCode);
      const response: any = await urlApi.getUrlByShortCode(shortCode);
      console.log('URL details response:', response);
      
      // Check if the response has the expected structure
      if (response && response.success && response.data) {
        return response.data as Url;
      } else {
        console.error('Invalid URL details response:', response);
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch URL details');
      console.error('Error fetching URL details:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  // Function to trigger data fetching from components
  const triggerFetch = () => {
    console.log('Triggering fetch requested by component');
    setShouldFetch(true);
  };

  return (
    <UrlContext.Provider
      value={{
        urls,
        isLoading,
        error,
        totalUrls,
        currentPage,
        totalPages,
        addUrl,
        deleteUrl,
        getUrlDetails,
        fetchUrls,
        clearError,
        triggerFetch
      }}
    >
      {children}
    </UrlContext.Provider>
  );
};

export const useUrl = () => {
  const context = useContext(UrlContext);
  if (context === undefined) {
    throw new Error('useUrl must be used within a UrlProvider');
  }
  return context;
};
