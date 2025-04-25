import express from 'express';
import { 
  getUrlAnalytics, 
  getDashboard 
} from '../controllers/analytics.controller';
import { protect } from '../middleware/auth.middleware';
import { authenticatedLimiter } from '../middleware/rateLimit.middleware';

const router = express.Router();

// All analytics routes are protected and rate limited
router.get('/urls/:id', protect, authenticatedLimiter, getUrlAnalytics);
router.get('/dashboard', protect, authenticatedLimiter, getDashboard);

export default router;
