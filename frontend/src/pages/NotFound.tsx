import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-light px-16">
      <div className="text-center">
        <h1 className="text-h1 font-bold text-primary mb-16">404</h1>
        <h2 className="text-h2 mb-16">Page Not Found</h2>
        <p className="text-neutral-mid mb-32">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
