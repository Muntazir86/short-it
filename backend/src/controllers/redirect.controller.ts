import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';
import { AppError } from '../middleware/error.middleware';

// Redirect to the original URL and track click data
export const redirectToUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { shortCode } = req.params;
    
    // Find URL by short code
    const url = await prisma.url.findUnique({
      where: { shortCode }
    });
    
    // Check if URL exists
    if (!url) {
      return next(
        new AppError('URL not found', 404, 'URL_NOT_FOUND')
      );
    }
    
    // Check if URL has expired
    if (url.expiresAt && url.expiresAt < new Date()) {
      return next(
        new AppError('URL has expired', 410, 'URL_EXPIRED')
      );
    }
    
    // Extract click data from request
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'] || '';
    const referrer = req.headers.referer || 'direct';
    
    // Parse user agent to extract browser, OS, and device type
    const browser = getBrowserFromUserAgent(userAgent);
    const os = getOSFromUserAgent(userAgent);
    const deviceType = getDeviceTypeFromUserAgent(userAgent);
    
    // Get geolocation data (in a real implementation, this would use a geolocation service)
    // For this example, we'll use placeholder values
    const country = 'US'; // This would come from a geolocation service
    const city = 'New York'; // This would come from a geolocation service
    
    // Create click record asynchronously (don't wait for it to complete)
    prisma.click.create({
      data: {
        urlId: url.id,
        ipAddress,
        country,
        city,
        referrer,
        browser,
        deviceType,
        os
      }
    }).catch(err => console.error('Error recording click:', err));
    
    // Increment click count
    prisma.url.update({
      where: { id: url.id },
      data: { clicks: { increment: 1 } }
    }).catch(err => console.error('Error incrementing click count:', err));
    
    // Redirect to the original URL
    res.redirect(url.originalUrl);
  } catch (error) {
    next(error);
  }
};

// Helper functions to parse user agent string
function getBrowserFromUserAgent(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) return 'Internet Explorer';
  return 'Other';
}

function getOSFromUserAgent(userAgent: string): string {
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac OS')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
  return 'Other';
}

function getDeviceTypeFromUserAgent(userAgent: string): string {
  if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) return 'mobile';
  if (userAgent.includes('iPad') || userAgent.includes('Tablet')) return 'tablet';
  return 'desktop';
}
