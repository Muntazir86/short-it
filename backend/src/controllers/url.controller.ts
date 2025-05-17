import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';
import { AppError } from '../middleware/error.middleware';
import { 
  generateUniqueShortCode, 
  isValidUrl, 
  getFullShortUrl,
  isShortCodeUnique 
} from '../utils/url.utils';

// Create a new shortened URL
export const createUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { originalUrl, customCode } = req.body;
    
    // Validate URL
    if (!isValidUrl(originalUrl)) {
      return next(
        new AppError('Invalid URL format', 400, 'INVALID_URL')
      );
    }
    
    let shortCode;
    
    // Handle custom code if provided
    if (customCode) {
      // Check if user is premium (only premium users can use custom codes)
      if (req.user && !req.user.isPremium) {
        return next(
          new AppError('Custom codes are only available for premium users', 403, 'PREMIUM_REQUIRED')
        );
      }
      
      // Check if custom code is available
      const isUnique = await isShortCodeUnique(customCode);
      if (!isUnique) {
        return next(
          new AppError('Custom code already exists', 409, 'CODE_EXISTS')
        );
      }
      
      shortCode = customCode;
    } else {
      // Generate a random short code
      shortCode = await generateUniqueShortCode();
    }
    
    // Set expiration date (premium users can have longer expiration)
    const expiresAt = req.user && req.user.isPremium
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year for premium
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);  // 30 days for regular
    
    // Since we're now using the protect middleware, req.user should always be available
    if (!req.user || !req.user.id) {
      return next(
        new AppError('Authentication required to create URLs', 401, 'UNAUTHORIZED')
      );
    }
    
    console.log('Creating URL for authenticated user:', { userId: req.user.id });
    
    // Create URL in database with the authenticated user's ID
    const url = await prisma.url.create({
      data: {
        originalUrl,
        shortCode,
        expiresAt,
        userId: req.user.id, // User ID is guaranteed to exist now
        isPrivate: req.body.isPrivate || false // Handle private URLs based on request
      }
    });
    
    // Return the created URL
    res.status(201).json({
      success: true,
      data: {
        id: url.id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: getFullShortUrl(url.shortCode),
        createdAt: url.createdAt,
        expiresAt: url.expiresAt,
        userId: url.userId,
        clicks: url.clicks
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all URLs for the authenticated user
export const getUrls = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Parse pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const order = (req.query.order as string) || 'desc';
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Get total count for pagination
    const total = await prisma.url.count({
      where: {
        userId: req.user?.id
      }
    });
    
    // Get URLs for the current user
    const urls = await prisma.url.findMany({
      where: {
        userId: req.user?.id
      },
      orderBy: {
        [sortBy]: order
      },
      skip,
      take: limit
    });
    
    // Format URLs for response
    const formattedUrls = urls.map(url => ({
      id: url.id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl: getFullShortUrl(url.shortCode),
      createdAt: url.createdAt,
      clicks: url.clicks
    }));
    
    // Return paginated results
    res.status(200).json({
      success: true,
      data: {
        urls: formattedUrls,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page,
          limit
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get a specific URL by short code
export const getUrlByShortCode = async (
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
    
    // Check if URL is private and user is authorized
    if (url.isPrivate && (!req.user || url.userId !== req.user.id)) {
      return next(
        new AppError('Not authorized to access this URL', 401, 'UNAUTHORIZED')
      );
    }
    
    // Return URL details
    res.status(200).json({
      success: true,
      data: {
        id: url.id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: getFullShortUrl(url.shortCode),
        createdAt: url.createdAt,
        expiresAt: url.expiresAt,
        userId: url.userId,
        clicks: url.clicks,
        isPrivate: url.isPrivate
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update a URL (premium users only)
export const updateUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { customCode, isPrivate, expiresAt } = req.body;
    
    // Find URL by ID
    const url = await prisma.url.findUnique({
      where: { id }
    });
    
    // Check if URL exists
    if (!url) {
      return next(
        new AppError('URL not found', 404, 'URL_NOT_FOUND')
      );
    }
    
    // Check if user owns the URL
    if (url.userId !== req.user?.id) {
      return next(
        new AppError('Not authorized to update this URL', 401, 'UNAUTHORIZED')
      );
    }
    
    // Handle custom code change if provided
    if (customCode && customCode !== url.shortCode) {
      // Check if custom code is available
      const isUnique = await isShortCodeUnique(customCode);
      if (!isUnique) {
        return next(
          new AppError('Custom code already exists', 409, 'CODE_EXISTS')
        );
      }
    }
    
    // Update URL in database
    const updatedUrl = await prisma.url.update({
      where: { id },
      data: {
        shortCode: customCode || url.shortCode,
        isPrivate: isPrivate !== undefined ? isPrivate : url.isPrivate,
        expiresAt: expiresAt ? new Date(expiresAt) : url.expiresAt
      }
    });
    
    // Return the updated URL
    res.status(200).json({
      success: true,
      data: {
        id: updatedUrl.id,
        originalUrl: updatedUrl.originalUrl,
        shortCode: updatedUrl.shortCode,
        shortUrl: getFullShortUrl(updatedUrl.shortCode),
        createdAt: updatedUrl.createdAt,
        updatedAt: updatedUrl.updatedAt,
        expiresAt: updatedUrl.expiresAt,
        userId: updatedUrl.userId,
        clicks: updatedUrl.clicks,
        isPrivate: updatedUrl.isPrivate
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete a URL
export const deleteUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    
    // Find URL by ID
    const url = await prisma.url.findUnique({
      where: { id }
    });
    
    // Check if URL exists
    if (!url) {
      return next(
        new AppError('URL not found', 404, 'URL_NOT_FOUND')
      );
    }
    
    // Check if user owns the URL
    if (url.userId !== req.user?.id) {
      return next(
        new AppError('Not authorized to delete this URL', 401, 'UNAUTHORIZED')
      );
    }
    
    // Delete URL from database
    await prisma.url.delete({
      where: { id }
    });
    
    // Return success message
    res.status(200).json({
      success: true,
      message: 'URL deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
