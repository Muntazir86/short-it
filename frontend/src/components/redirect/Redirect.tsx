import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Url } from '../../types';

const Redirect: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const redirectToOriginalUrl = async () => {
      if (!shortCode) {
        navigate('/');
        return;
      }

      try {
        console.log('Redirecting short URL:', shortCode);
        
        // Instead of using the frontend API, we'll directly redirect to the backend URL
        // The backend is running on port 5000 and has a redirect endpoint set up
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
        console.log('Using backend URL for redirection:', backendUrl);
        window.location.href = `${backendUrl}/${shortCode}`;
        
        // Note: The code below is not needed anymore since we're letting the backend handle the redirect
        // But we'll keep it commented out for reference
        /*
        const response = await axios.get(`http://localhost:5000/${shortCode}`);
        
        if (response.status === 200) {
          const originalUrl = response.data.originalUrl;
          
          // Check if URL starts with http:// or https://
          if (originalUrl.startsWith('http://') || originalUrl.startsWith('https://')) {
            window.location.href = originalUrl;
          } else {
            window.location.href = `https://${originalUrl}`;
          }
        } else {
          setError('URL not found or has expired');
          setTimeout(() => navigate('/'), 3000);
        }
        */
      } catch (err) {
        console.error('Error redirecting:', err);
        setError('Error redirecting to original URL');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    redirectToOriginalUrl();
  }, [shortCode, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-light">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-h3 text-center mb-4">Redirecting...</h1>
        {error && (
          <div className="text-red-500 text-center mb-4">
            {error}
            <p className="text-sm mt-2">Redirecting to homepage in 3 seconds...</p>
          </div>
        )}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    </div>
  );
};

export default Redirect;
