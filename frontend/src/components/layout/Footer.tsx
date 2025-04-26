import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-neutral-dark text-white py-48">
      <div className="container mx-auto px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-32">
          <div>
            <h3 className="text-h3 font-bold mb-16">Short-It</h3>
            <p className="text-neutral-mid">
              Modern URL shortening service with powerful analytics and management features.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-16">Product</h4>
            <ul className="space-y-8">
              <li>
                <Link to="/" className="text-neutral-mid hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/" className="text-neutral-mid hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/" className="text-neutral-mid hover:text-white">
                  API
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-16">Company</h4>
            <ul className="space-y-8">
              <li>
                <Link to="/" className="text-neutral-mid hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link to="/" className="text-neutral-mid hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/" className="text-neutral-mid hover:text-white">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-16">Legal</h4>
            <ul className="space-y-8">
              <li>
                <Link to="/" className="text-neutral-mid hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="text-neutral-mid hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/" className="text-neutral-mid hover:text-white">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-48 pt-16 border-t border-neutral-mid text-center">
          <p className="text-neutral-mid">
            &copy; {currentYear} Short-It. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
