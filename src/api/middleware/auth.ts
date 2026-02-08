import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../core/AuthService';
import { UserRepository } from '../../infra/repositories/UserRepository';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: any;
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = AuthService.verifyToken(token);

      // Verify user still exists
      const userRepo = new UserRepository();
      const user = await userRepo.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      req.userId = decoded.userId;
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Authentication error' });
  }
}

// Optional auth middleware - doesn't fail if no token
export async function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      try {
        const decoded = AuthService.verifyToken(token);
        const userRepo = new UserRepository();
        const user = await userRepo.findById(decoded.userId);

        if (user) {
          req.userId = decoded.userId;
          req.user = user;
        }
      } catch (error) {
        // Silently fail for optional auth
      }
    }

    next();
  } catch (error) {
    next();
  }
}
