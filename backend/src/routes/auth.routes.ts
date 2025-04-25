import express from 'express';
import { register, login, getMe, logout } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { authenticatedLimiter } from '../middleware/rateLimit.middleware';

const router = express.Router();

// Public routes with rate limiting
router.post('/register', authenticatedLimiter, register);
router.post('/login', authenticatedLimiter, login);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;
