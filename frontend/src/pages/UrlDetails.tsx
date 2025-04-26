import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUrl } from '../context/UrlContext';

const UrlDetails: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const { isAuthenticated } = useAuth();
  const { getUrlDetails } = useUrl();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const urlData = shortCode ? getUrlDetails(shortCode) : undefined;

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
