import { Router, Request, Response } from 'express';
import { UserRepository } from '../../infra/repositories/UserRepository';
import { AuthService } from '../../core/AuthService';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const userRepo = new UserRepository();

// POST /api/auth/register - Register new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const user = await userRepo.create({ email, password, name });
    const token = AuthService.generateToken(user.id);

    res.status(201).json(AuthService.createAuthResponse(user, token));
  } catch (error: any) {
    if (error.message.includes('already registered')) {
      return res.status(409).json({ error: error.message });
    }
    if (error.message.includes('Invalid')) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// POST /api/auth/login - Login user
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await userRepo.verifyCredentials(email, password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = AuthService.generateToken(user.id);

    res.json(AuthService.createAuthResponse(user, token));
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// GET /api/auth/me - Get current user info
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await userRepo.findById(req.userId!);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

export default router;
