import express from 'express';
import { 
  createUrl, 
  getUrls, 
  getUrlByShortCode, 
  updateUrl, 
  deleteUrl 
} from '../controllers/url.controller';
import { protect, premiumOnly } from '../middleware/auth.middleware';
import { 
  anonymousLimiter, 
  authenticatedLimiter, 
  premiumLimiter 
} from '../middleware/rateLimit.middleware';

const router = express.Router();

// Protected routes with authenticated rate limiting
router.post('/', protect, authenticatedLimiter, createUrl);

// Protected routes with authenticated rate limiting
router.get('/', protect, authenticatedLimiter, getUrls);

// Protected route for getting URL details by shortCode (for authenticated users)
// This specific route must come BEFORE the generic /:shortCode route
router.get('/details/:shortCode', protect, authenticatedLimiter, getUrlByShortCode);

// Public route for getting URL by shortCode (for redirection)
router.get('/:shortCode', getUrlByShortCode);

// Premium user routes
router.patch('/:id', protect, premiumLimiter, premiumOnly, updateUrl);

// Protected routes for all authenticated users
router.delete('/:id', protect, authenticatedLimiter, deleteUrl);

export default router;
