import React from 'react';
import { Link } from 'react-router-dom';
import { useUrl } from '../../context/UrlContext';
import { Url } from '../../types';

const UrlList: React.FC = () => {
  const { urls = [], isLoading, deleteUrl } = useUrl();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const truncateUrl = (url: string, maxLength = 50) => {
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  const handleCopy = (shortCode: string) => {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    navigator.clipboard.writeText(`${baseUrl}/${shortCode}`);
    // You could add a toast notification here
  };

  if (isLoading) {
    return (
      <div className="text-center py-48">
        <h3>Loading your URLs...</h3>
      </div>
    );
  }
  
  if (!urls || urls.length === 0) {
    return (
      <div className="text-center py-48">
        <h3>You haven't shortened any URLs yet</h3>
        <p className="mt-8 text-neutral-mid">Use the form above to create your first short URL</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full mt-24">
        <thead className="bg-neutral-light">
          <tr>
            <th className="p-16 text-left">Original URL</th>
            <th className="p-16 text-left">Short URL</th>
            <th className="p-16 text-left">Created</th>
            <th className="p-16 text-left">Clicks</th>
            <th className="p-16 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => (
            <tr key={url.id} className="border-b border-neutral-light">
              <td className="p-16">
                <a 
                  href={url.originalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neutral-dark hover:text-primary"
                >
                  {truncateUrl(url.originalUrl)}
                </a>
              </td>
              <td className="p-16">
                <span className="text-primary font-medium">
                  {`${process.env.REACT_APP_BASE_URL}/${url.shortCode}`}
                </span>
              </td>
              <td className="p-16">{formatDate(url.createdAt)}</td>
              <td className="p-16">{url.clicks}</td>
              <td className="p-16">
                <div className="flex space-x-8">
                  <button
                    onClick={() => handleCopy(url.shortCode)}
                    className="text-primary hover:text-opacity-80"
                  >
                    Copy
                  </button>
                  <Link
                    to={`/url/${url.shortCode}`}
                    className="text-secondary hover:text-opacity-80 mx-8"
                  >
                    Stats
                  </Link>
                  <button
                    onClick={() => deleteUrl(url.id)}
                    className="text-accent hover:text-opacity-80"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UrlList;
