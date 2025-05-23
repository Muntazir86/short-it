import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUrl } from '../context/UrlContext';
import UrlShortener from '../components/url/UrlShortener';
import UrlList from '../components/url/UrlList';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { triggerFetch, isLoading } = useUrl();
  
  // Explicitly request URL data when the dashboard loads
  useEffect(() => {
    console.log('Dashboard mounted, triggering URL fetch');
    triggerFetch();
  }, [triggerFetch]);

  return (
    <div className="container mx-auto px-16 py-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-32">
        <div>
          <h1 className="text-h2">Dashboard</h1>
          <p className="text-neutral-mid">Manage your shortened URLs</p>
        </div>
        <div className="mt-16 md:mt-0">
          <p className="text-small text-neutral-mid">
            Welcome back, <span className="font-medium">{user?.name}</span>
          </p>
        </div>
      </div>

      <div className="card mb-32">
        <h2 className="text-h3 mb-16">Create New Short URL</h2>
        <UrlShortener />
      </div>

      <div className="card">
        <h2 className="text-h3 mb-16">Your URLs</h2>
        <UrlList />
      </div>
    </div>
  );
};

export default Dashboard;
