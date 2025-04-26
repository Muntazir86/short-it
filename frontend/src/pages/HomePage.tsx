import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UrlShortener from '../components/url/UrlShortener';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-12 md:mb-0 md:pr-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-6">
              <span className="text-blue-600">Shorten</span> Your Links,<br />
              <span className="text-blue-600">Expand</span> Your Reach
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Create short, memorable links that redirect to your long URLs. Track clicks and analyze your link performance.
            </p>
            
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                  Sign Up Free
                </Link>
                <Link to="/login" className="px-8 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
                  Log In
                </Link>
              </div>
            )}
          </div>
          <div className="md:w-1/2">
            <div className="bg-white p-6 rounded-xl shadow-xl">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                {isAuthenticated ? 'Shorten a URL' : 'Try it out'}
              </h3>
              <UrlShortener />
              {!isAuthenticated && (
                <p className="mt-4 text-sm text-gray-500 italic">
                  Sign up for free to access all features and manage your shortened URLs.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">Why Choose Short-It?</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Custom Short Links</h3>
            <p className="text-gray-600">
              Create branded, memorable links that reflect your content and enhance recognition.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Detailed Analytics</h3>
            <p className="text-gray-600">
              Track clicks, analyze geographic data, and understand your audience better.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Secure & Reliable</h3>
            <p className="text-gray-600">
              Enterprise-grade security with 99.9% uptime and fast redirects worldwide.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Link Management</h3>
            <p className="text-gray-600">
              Set expiration dates, edit destinations, and organize your links efficiently.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="container mx-auto px-6 py-16 md:py-24">
          <div className="bg-blue-600 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust Short-It for their link shortening needs.
            </p>
            <Link to="/register" className="inline-block px-8 py-4 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-md">
              Create Your Free Account
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
