import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUrl } from '../context/UrlContext';
import { useAuth } from '../context/AuthContext';
import { Url } from '../types';

const UrlDetails: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const { getUrlDetails, isLoading, error } = useUrl();
  const { token } = useAuth();
  const [urlData, setUrlData] = useState<Url | null>(null);
  const [isLoadingUrl, setIsLoadingUrl] = useState<boolean>(true);

  // Use a ref to track if we've already fetched data
  const dataFetched = React.useRef(false);

  // Fetch URL details when the component mounts - only once
  useEffect(() => {
    // Only fetch if we haven't fetched yet, and we have a shortCode and token
    if (!dataFetched.current && shortCode && token) {
      console.log('Component mounted, fetching URL details for:', shortCode);
      
      // Mark as fetched to prevent additional fetches
      dataFetched.current = true;
      
      // Set loading state
      setIsLoadingUrl(true);
      
      // Use the getUrlDetails function directly but only once
      const fetchData = async () => {
        try {
          const data = await getUrlDetails(shortCode);
          console.log('URL details received:', data);
          setUrlData(data);
        } catch (err) {
          console.error('Error fetching URL details:', err);
        } finally {
          setIsLoadingUrl(false);
        }
      };
      
      fetchData();
    }
    
    // No cleanup needed since we're not setting up any subscriptions
  }, []); // Empty dependency array means this only runs once on mount

  if (isLoadingUrl) {
    return (
      <div className="container mx-auto px-16 py-32 text-center">
        <h1 className="text-h2 mb-16">Loading...</h1>
        <p>Fetching URL details...</p>
      </div>
    );
  }

  if (!urlData) {
    return (
      <div className="container mx-auto px-16 py-32 text-center">
        <h1 className="text-h2 mb-16">URL Not Found</h1>
        <p>The URL you're looking for doesn't exist or has been deleted.</p>
      </div>
    );
  }

  const fullShortUrl = `${window.location.origin}/${urlData.shortCode}`;

  return (
    <div className="container mx-auto px-16 py-32">
      <h1 className="text-h2 mb-32">URL Details</h1>

      <div className="grid md:grid-cols-3 gap-24 mb-32">
        <div className="card col-span-2">
          <h2 className="text-h3 mb-16">URL Information</h2>
          
          <div className="mb-16">
            <p className="text-small text-neutral-mid mb-4">Original URL</p>
            <a 
              href={urlData.originalUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary break-all"
            >
              {urlData.originalUrl}
            </a>
          </div>
          
          <div className="mb-16">
            <p className="text-small text-neutral-mid mb-4">Short URL</p>
            <div className="flex items-center">
              <p className="text-primary font-medium break-all">{fullShortUrl}</p>
              <button 
                onClick={() => navigator.clipboard.writeText(fullShortUrl)}
                className="ml-8 text-neutral-mid hover:text-primary"
              >
                Copy
              </button>
            </div>
          </div>
          
          <div className="mb-16">
            <p className="text-small text-neutral-mid mb-4">Created On</p>
            <p>{new Date(urlData.createdAt).toLocaleDateString()}</p>
          </div>
          
          <div>
            <p className="text-small text-neutral-mid mb-4">Total Clicks</p>
            <p className="text-h3 font-bold text-primary">{urlData.clicks}</p>
          </div>
        </div>
        
        <div className="card flex flex-col items-center justify-center">
          <h2 className="text-h3 mb-16">QR Code</h2>
          <div className="w-48 h-48 bg-neutral-light flex items-center justify-center">
            QR Code Placeholder
          </div>
          <button className="btn-secondary mt-16">Download QR Code</button>
        </div>
      </div>

      <div className="card">
        <h2 className="text-h3 mb-24">Analytics</h2>
        <div className="grid md:grid-cols-2 gap-24">
          <div>
            <h3 className="text-h3 mb-16">Click Trends</h3>
            <div className="h-64 bg-neutral-light rounded flex items-center justify-center">
              Chart Placeholder
            </div>
          </div>
          <div>
            <h3 className="text-h3 mb-16">Top Referrers</h3>
            <div className="h-64 bg-neutral-light rounded flex items-center justify-center">
              Chart Placeholder
            </div>
          </div>
          <div>
            <h3 className="text-h3 mb-16">Geographic Distribution</h3>
            <div className="h-64 bg-neutral-light rounded flex items-center justify-center">
              Map Placeholder
            </div>
          </div>
          <div>
            <h3 className="text-h3 mb-16">Device Breakdown</h3>
            <div className="h-64 bg-neutral-light rounded flex items-center justify-center">
              Chart Placeholder
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlDetails;
