import { Router } from 'express';
import {
  register,
  login,
  getProfile,
  logout,
  refreshAccessToken
} from '../../controllers/auth.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const authRouter = Router();

// Public routes
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/refresh', refreshAccessToken);

// Protected routes
authRouter.get('/profile', authMiddleware, getProfile);
authRouter.post('/logout', authMiddleware, logout);

export {authRouter as authRoutes};
