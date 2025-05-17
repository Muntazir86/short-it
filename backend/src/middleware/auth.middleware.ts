import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { AppError } from './error.middleware';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        isPremium: boolean;
      };
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;
    
    // Check if token exists in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // If no token found, return unauthorized error
    if (!token) {
      return next(
        new AppError('Not authorized to access this route', 401, 'UNAUTHORIZED')
      );
    }
    
    // Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    
    // Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });
    
    if (!user) {
      return next(
        new AppError('User belonging to this token no longer exists', 401, 'UNAUTHORIZED')
      );
    }
    
    // Add user to request object
    req.user = {
      id: user.id,
      email: user.email,
      isPremium: user.isPremium
    };
    
    next();
  } catch (error) {
    return next(
      new AppError('Not authorized to access this route', 401, 'UNAUTHORIZED')
    );
  }
};

// Middleware to check if user is premium
export const premiumOnly = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || !req.user.isPremium) {
    return next(
      new AppError('This route is restricted to premium users', 403, 'FORBIDDEN')
    );
  }
  
  next();
};
