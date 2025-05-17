import React, { useState } from 'react';
import { useUrl } from '../../context/UrlContext';
import { useAuth } from '../../context/AuthContext';
import { Url } from '../../types';

const UrlShortener: React.FC = () => {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  
  const { addUrl, isLoading, error } = useUrl();
  const { isAuthenticated, user } = useAuth();
  
  const isPremiumUser = user?.isPremium || false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!url) {
      return;
    }
    
    // Check if user is authenticated (now required for URL creation)
    if (!isAuthenticated) {
      // Show error or redirect to login
      alert('You must be logged in to create shortened URLs');
      return;
    }
    
    // Validate custom code if provided (only for premium users)
    if (customCode && !isPremiumUser) {
      alert('Custom codes are only available for premium users');
      return;
    }
    
    try {      
      const options: { customCode?: string; isPrivate?: boolean } = {};
      
      if (isPremiumUser && customCode) {
        options.customCode = customCode;
      }
      
      if (isPremiumUser && isPrivate) {
        options.isPrivate = isPrivate;
      }
      
      const result = await addUrl(url, options.customCode, options.isPrivate);
      
      // Get the base URL from the window location
      const baseUrl = process.env.REACT_APP_BASE_URL;
      setShortenedUrl(`${baseUrl}/${result.shortCode}`);
      
      // Clear input if not authenticated (for homepage)
      if (!isAuthenticated) {
        setUrl('');
        setCustomCode('');
        setIsPrivate(false);
        setShowOptions(false);
      }
    } catch (err) {
      console.error(err);
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-grow">
            <input
              type="url"
              value={url}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
              placeholder="Enter your long URL here"
              className="input"
              disabled={isLoading}
              required
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
        </div>
        
        {isAuthenticated && isPremiumUser && (
          <div className="flex items-center gap-8 mt-8">
            <button 
              type="button" 
              className="text-primary text-sm underline"
              onClick={() => setShowOptions(!showOptions)}
            >
              {showOptions ? 'Hide premium options' : 'Show premium options'}
            </button>
          </div>
        )}
        
        {showOptions && isPremiumUser && (
          <div className="grid md:grid-cols-2 gap-16 mt-8 p-16 bg-neutral-light rounded">
            <div>
              <label className="block mb-8 font-medium">Custom URL code (optional)</label>
              <input
                type="text"
                value={customCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomCode(e.target.value)}
                placeholder="e.g., my-brand"
                className="input"
                disabled={isLoading}
                maxLength={20}
              />
              <p className="text-sm text-neutral-mid mt-4">Only letters, numbers, and hyphens. Max 20 characters.</p>
            </div>
            
            <div>
              <label className="block mb-8 font-medium">Privacy settings</label>
              <div className="flex items-center gap-8">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={isPrivate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsPrivate(e.target.checked)}
                  className="checkbox"
                  disabled={isLoading}
                />
                <label htmlFor="isPrivate">Make this URL private</label>
              </div>
              <p className="text-sm text-neutral-mid mt-4">Private URLs can only be accessed by you</p>
            </div>
          </div>
        )}
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
