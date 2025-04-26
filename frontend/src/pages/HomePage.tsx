import React from 'react';
import { Link } from 'react-router-dom';
import UrlShortener from '../components/url/UrlShortener';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-16 py-48">
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="text-h1 font-bold mb-16">Shorten Your Links, Expand Your Reach</h1>
        <p className="text-neutral-mid text-lg mb-32">
          Create short, memorable links that redirect to your long URLs. Track clicks and analyze your link performance.
        </p>
        
        <div className="mt-32 mb-48">
          <UrlShortener />
        </div>
      </section>
      
      <section className="py-64">
        <h2 className="text-h2 text-center mb-48">Why Choose Short-It?</h2>
        
        <div className="grid md:grid-cols-3 gap-24">
          <div className="card text-center p-24">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-16">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="mb-8">Lightning Fast</h3>
            <p className="text-neutral-mid">Create short links in seconds and enjoy rapid redirects.</p>
          </div>
          
          <div className="card text-center p-24">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-16">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="mb-8">Detailed Analytics</h3>
            <p className="text-neutral-mid">Track clicks, analyze traffic sources, and measure performance.</p>
          </div>
          
          <div className="card text-center p-24">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-16">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="mb-8">Secure & Reliable</h3>
            <p className="text-neutral-mid">Enterprise-grade infrastructure ensures your links never go down.</p>
          </div>
        </div>
      </section>
      
      <section className="py-48 text-center">
        <h2 className="text-h2 mb-16">Ready to get started?</h2>
        <p className="mb-24">Create an account to access all features and manage your links.</p>
        <div className="flex justify-center gap-16">
          <Link to="/register" className="btn-primary">Sign Up Free</Link>
          <Link to="/login" className="btn-secondary">Log In</Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
