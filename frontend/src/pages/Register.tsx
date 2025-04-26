import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-light px-16 py-32">
      <div className="card max-w-md w-full p-32">
        <div className="text-center mb-32">
          <h1 className="text-h2 mb-8">Create an Account</h1>
          <p className="text-neutral-mid">Sign up to start shortening URLs</p>
        </div>
        
        {error && (
          <div className="bg-accent bg-opacity-10 text-accent p-16 rounded mb-16">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-16">
            <label htmlFor="name" className="block text-neutral-dark mb-8">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-16">
            <label htmlFor="email" className="block text-neutral-dark mb-8">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-16">
            <label htmlFor="password" className="block text-neutral-dark mb-8">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-24">
            <label htmlFor="confirmPassword" className="block text-neutral-dark mb-8">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-24">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-8"
                required
              />
              <span className="text-small">
                I agree to the{' '}
                <Link to="/" className="text-primary">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/" className="text-primary">
                  Privacy Policy
                </Link>
              </span>
            </label>
          </div>
          
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-24 text-center">
          <p className="text-neutral-mid">
            Already have an account?{' '}
            <Link to="/login" className="text-primary">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
