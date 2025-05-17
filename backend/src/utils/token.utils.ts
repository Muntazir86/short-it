import jwt, { Secret, SignOptions } from 'jsonwebtoken';

interface TokenPayload {
  id: string;
}

// Generate JWT token for authentication
export const generateToken = (id: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  const payload: TokenPayload = { id };
  const secret: Secret = process.env.JWT_SECRET;
  // Use a literal string type that matches jwt expected format
  const expiresIn = '24h';
  const options: SignOptions = { expiresIn };
  
  return jwt.sign(payload, secret, options);
};

// Verify JWT token
export const verifyToken = (token: string): TokenPayload | null => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};
