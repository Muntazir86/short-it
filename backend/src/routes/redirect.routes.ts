import express from 'express';
import { redirectToUrl } from '../controllers/redirect.controller';
import { anonymousLimiter } from '../middleware/rateLimit.middleware';

const router = express.Router();

// Redirect route with anonymous rate limiting
router.get('/:shortCode', anonymousLimiter, redirectToUrl);

export default router;
