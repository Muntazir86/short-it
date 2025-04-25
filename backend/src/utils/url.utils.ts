import { prisma } from '../server';

// Generate a random short code for URLs
export const generateShortCode = (length: number = 6): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

// Check if a short code already exists in the database
export const isShortCodeUnique = async (shortCode: string): Promise<boolean> => {
  const existingUrl = await prisma.url.findUnique({
    where: { shortCode }
  });
  
  return !existingUrl;
};

// Generate a unique short code that doesn't exist in the database
export const generateUniqueShortCode = async (length: number = 6): Promise<string> => {
  let shortCode = generateShortCode(length);
  let isUnique = await isShortCodeUnique(shortCode);
  
  // Keep generating until we find a unique code
  while (!isUnique) {
    shortCode = generateShortCode(length);
    isUnique = await isShortCodeUnique(shortCode);
  }
  
  return shortCode;
};

// Validate URL format
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

// Create the full short URL from a short code
export const getFullShortUrl = (shortCode: string): string => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  return `${baseUrl}/${shortCode}`;
};
