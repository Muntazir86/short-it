import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-light px-16">
      <div className="card max-w-md w-full p-32">
        <div className="text-center mb-32">
          <h1 className="text-h2 mb-8">Welcome Back</h1>
          <p className="text-neutral-mid">Log in to manage your short URLs</p>
        </div>
        
        {error && (
          <div className="bg-accent bg-opacity-10 text-accent p-16 rounded mb-16">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
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
          
          <div className="mb-24">
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
          
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className="mt-24 text-center">
          <p className="text-neutral-mid">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
