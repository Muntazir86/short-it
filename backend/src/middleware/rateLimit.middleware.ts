import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { AppError } from './error.middleware';

// Rate limit configuration based on user type
export const createRateLimiter = (type: 'anonymous' | 'authenticated' | 'premium') => {
  const limits = {
    anonymous: 60,      // 60 requests per hour for anonymous users
    authenticated: 1000, // 1000 requests per hour for authenticated users
    premium: 5000       // 5000 requests per hour for premium users
  };

  const limit = limits[type];
  const windowMs = 60 * 60 * 1000; // 1 hour in milliseconds

  return rateLimit({
    windowMs,
    max: limit,
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: `Rate limit exceeded. Please try again after some time.`
      }
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
    // Custom handler to set the proper headers format as specified in API docs
    handler: (req: Request, res: Response, next: NextFunction, options: any) => {
      res.set('X-RateLimit-Limit', String(limit));
      res.set('X-RateLimit-Remaining', String(options.remainingPoints));
      res.set('X-RateLimit-Reset', String(Math.ceil(Date.now() / 1000) + Math.ceil(options.resetTime / 1000)));
      
      res.status(429).json(options.message);
    },
    // Skip if user is premium and using authenticated limiter
    skip: (req: Request, res: Response) => {
      if (type === 'authenticated' && req.user && req.user.isPremium) {
        return true;
      }
      return false;
    },
    keyGenerator: (req: Request) => {
      // Use user ID for authenticated users, IP for anonymous
      return req.user ? req.user.id : req.ip;
    }
  });
};

// Export specific rate limiters
export const anonymousLimiter = createRateLimiter('anonymous');
export const authenticatedLimiter = createRateLimiter('authenticated');
export const premiumLimiter = createRateLimiter('premium');
