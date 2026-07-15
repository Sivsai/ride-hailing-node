import { Router, Request, Response, NextFunction } from 'express';
import { getIO } from '../config/socket';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Driver pushes location update
router.post('/location', authenticate, async (req: any, res: Response, next: NextFunction) => {
  try {
    const { tripId, lat, lng } = req.body;
    const driverId = req.user.userId;

    // Update Redis via geo-service logic (import directly)
    // Emit to all riders watching this trip
    getIO().to(`trip:${tripId}`).emit('driver:location', {
      driverId,
      lat,
      lng,
      timestamp: new Date(),
    });

    res.json({ message: 'Location broadcasted' });
  } catch (err) { next(err); }
});

export default router;