import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UrlData {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  clicks: number;
}

interface UrlContextType {
  urls: UrlData[];
  addUrl: (originalUrl: string) => Promise<UrlData>;
  deleteUrl: (id: string) => void;
  getUrlDetails: (shortCode: string) => UrlData | undefined;
}

const UrlContext = createContext<UrlContextType | undefined>(undefined);

export const UrlProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [urls, setUrls] = useState<UrlData[]>([]);

  const addUrl = async (originalUrl: string): Promise<UrlData> => {
    // This would be replaced with an actual API call
    const newUrl: UrlData = {
      id: Date.now().toString(),
      originalUrl,
      shortCode: Math.random().toString(36).substring(2, 8),
      createdAt: new Date(),
      clicks: 0,
    };
    
    setUrls((prevUrls) => [...prevUrls, newUrl]);
    return newUrl;
  };

  const deleteUrl = (id: string) => {
    setUrls((prevUrls) => prevUrls.filter((url) => url.id !== id));
  };

  const getUrlDetails = (shortCode: string) => {
    return urls.find((url) => url.shortCode === shortCode);
  };

  return (
    <UrlContext.Provider
      value={{
        urls,
        addUrl,
        deleteUrl,
        getUrlDetails,
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
