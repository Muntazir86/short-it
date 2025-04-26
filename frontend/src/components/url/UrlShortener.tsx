import React, { useState } from 'react';
import { useUrl } from '../../context/UrlContext';
import { useAuth } from '../../context/AuthContext';

const UrlShortener: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
  
  const { addUrl } = useUrl();
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!url) {
      setError('Please enter a URL');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await addUrl(url);
      const baseUrl = window.location.origin;
      setShortenedUrl(`${baseUrl}/${result.shortCode}`);
      
      // Clear input if not authenticated (for homepage)
      if (!isAuthenticated) {
        setUrl('');
      }
    } catch (err) {
      setError('Failed to shorten URL. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (shortenedUrl) {
      navigator.clipboard.writeText(shortenedUrl);
      // You could add a toast notification here
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
        <div className="flex-grow">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your long URL here"
            className="input"
            disabled={isLoading}
          />
          {error && <p className="text-accent text-small mt-4">{error}</p>}
        </div>
        <button
          type="submit"
          className="btn-primary whitespace-nowrap"
          disabled={isLoading}
        >
          {isLoading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>
      
      {shortenedUrl && (
        <div className="mt-16 p-16 bg-neutral-light rounded flex flex-col md:flex-row items-center justify-between">
          <p className="font-medium text-primary break-all">{shortenedUrl}</p>
          <button
            onClick={handleCopy}
            className="btn-secondary mt-8 md:mt-0"
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
};

export default UrlShortener;
