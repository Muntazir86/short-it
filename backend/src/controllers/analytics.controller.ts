import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma';
import { AppError } from '../middleware/error.middleware';

interface TotalClicksResult {
  total: number;
}

// Get analytics for a specific URL
export const getUrlAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const period = (req.query.period as string) || 'month';
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
    
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
        new AppError('Not authorized to view analytics for this URL', 401, 'UNAUTHORIZED')
      );
    }
    
    // Calculate date range based on period
    let dateFilter: any = {};
    const now = new Date();
    
    if (startDate && endDate) {
      // Custom date range
      dateFilter = {
        clickedAt: {
          gte: startDate,
          lte: endDate
        }
      };
    } else {
      // Predefined periods
      switch (period) {
        case 'day':
          dateFilter = {
            clickedAt: {
              gte: new Date(now.setHours(0, 0, 0, 0))
            }
          };
          break;
        case 'week':
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          dateFilter = {
            clickedAt: {
              gte: weekAgo
            }
          };
          break;
        case 'month':
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          dateFilter = {
            clickedAt: {
              gte: monthAgo
            }
          };
          break;
        case 'year':
          const yearAgo = new Date();
          yearAgo.setFullYear(yearAgo.getFullYear() - 1);
          dateFilter = {
            clickedAt: {
              gte: yearAgo
            }
          };
          break;
        case 'all':
        default:
          // No date filter for 'all'
          dateFilter = {};
          break;
      }
    }
    
    // Get total clicks for the URL in the specified period
    const totalClicks = await prisma.click.count({
      where: {
        urlId: id,
        ...dateFilter
      }
    });
    
    // Get clicks grouped by date
    const clicksByDate = await prisma.$queryRaw`
      SELECT DATE(clicked_at) as date, COUNT(*) as clicks
      FROM clicks
      WHERE url_id = ${id}
      AND clicked_at >= ${dateFilter.clickedAt?.gte || new Date(0)}
      ${dateFilter.clickedAt?.lte ? `AND clicked_at <= ${dateFilter.clickedAt.lte}` : ''}
      GROUP BY DATE(clicked_at)
      ORDER BY date ASC
    `;
    
    // Get top referrers
    const referrers = await prisma.$queryRaw`
      SELECT referrer as source, COUNT(*) as clicks
      FROM clicks
      WHERE url_id = ${id}
      AND clicked_at >= ${dateFilter.clickedAt?.gte || new Date(0)}
      ${dateFilter.clickedAt?.lte ? `AND clicked_at <= ${dateFilter.clickedAt.lte}` : ''}
      GROUP BY referrer
      ORDER BY clicks DESC
      LIMIT 10
    `;
    
    // Get top locations (countries)
    const locations = await prisma.$queryRaw`
      SELECT country, COUNT(*) as clicks
      FROM clicks
      WHERE url_id = ${id}
      AND clicked_at >= ${dateFilter.clickedAt?.gte || new Date(0)}
      ${dateFilter.clickedAt?.lte ? `AND clicked_at <= ${dateFilter.clickedAt.lte}` : ''}
      GROUP BY country
      ORDER BY clicks DESC
      LIMIT 10
    `;
    
    // Get device types
    const devices = await prisma.$queryRaw`
      SELECT device_type as type, COUNT(*) as clicks
      FROM clicks
      WHERE url_id = ${id}
      AND clicked_at >= ${dateFilter.clickedAt?.gte || new Date(0)}
      ${dateFilter.clickedAt?.lte ? `AND clicked_at <= ${dateFilter.clickedAt.lte}` : ''}
      GROUP BY device_type
      ORDER BY clicks DESC
    `;
    
    // Get browsers
    const browsers = await prisma.$queryRaw`
      SELECT browser as name, COUNT(*) as clicks
      FROM clicks
      WHERE url_id = ${id}
      AND clicked_at >= ${dateFilter.clickedAt?.gte || new Date(0)}
      ${dateFilter.clickedAt?.lte ? `AND clicked_at <= ${dateFilter.clickedAt.lte}` : ''}
      GROUP BY browser
      ORDER BY clicks DESC
      LIMIT 10
    `;
    
    // Return analytics data
    res.status(200).json({
      success: true,
      data: {
        totalClicks,
        clicksByDate,
        referrers,
        locations,
        devices,
        browsers
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get analytics dashboard for the authenticated user
export const getDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    
    // Get total URLs for the user
    const totalUrls = await prisma.url.count({
      where: { userId }
    });
    
    // Get total clicks for all user URLs
    const totalClicks = await prisma.$queryRaw<TotalClicksResult[]>`
      SELECT COUNT(*) as total FROM clicks 
      WHERE url_id IN (SELECT id FROM urls WHERE user_id = ${req.user?.id})
    `;
    
    // Get top performing URLs
    const topUrls = await prisma.url.findMany({
      where: { userId },
      orderBy: { clicks: 'desc' },
      take: 5,
      select: {
        id: true,
        shortCode: true,
        clicks: true
      }
    });
    
    // Format top URLs for response
    const formattedTopUrls = topUrls.map(url => ({
      id: url.id,
      shortCode: url.shortCode,
      shortUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/${url.shortCode}`,
      clicks: url.clicks
    }));
    
    // Get clicks over time (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const clicksOverTime = await prisma.$queryRaw`
      SELECT DATE(c.clicked_at) as date, COUNT(*) as clicks
      FROM clicks c
      JOIN urls u ON c.url_id = u.id
      WHERE u.user_id = ${userId}
      AND c.clicked_at >= ${sevenDaysAgo}
      GROUP BY DATE(c.clicked_at)
      ORDER BY date ASC
    `;
    
    // Get top referrers
    const topReferrers = await prisma.$queryRaw`
      SELECT c.referrer as source, COUNT(*) as clicks
      FROM clicks c
      JOIN urls u ON c.url_id = u.id
      WHERE u.user_id = ${userId}
      GROUP BY c.referrer
      ORDER BY clicks DESC
      LIMIT 5
    `;
    
    // Get top locations
    const topLocations = await prisma.$queryRaw`
      SELECT c.country, COUNT(*) as clicks
      FROM clicks c
      JOIN urls u ON c.url_id = u.id
      WHERE u.user_id = ${userId}
      GROUP BY c.country
      ORDER BY clicks DESC
      LIMIT 5
    `;
    
    // Return dashboard data
    res.status(200).json({
      success: true,
      data: {
        totalUrls,
        totalClicks: totalClicks[0]?.total || 0,
        topUrls: formattedTopUrls,
        clicksOverTime,
        topReferrers,
        topLocations
      }
    });
  } catch (error) {
    next(error);
  }
};
