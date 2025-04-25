import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode: number;
  code?: string;
  details?: any;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'SERVER_ERROR';
  
  console.error(`[Error] ${err.message}`, err.stack);
  
  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: err.message,
      details: err.details || undefined
    }
  });
};

export class AppError extends Error implements ApiError {
  statusCode: number;
  code: string;
  details?: any;

  constructor(message: string, statusCode: number, code?: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || 'ERROR';
    this.details = details;
    
    Error.captureStackTrace(this, this.constructor);
  }
}
