

import { Router, Request, Response, NextFunction } from 'express'
import { authenticate } from '../middleware/authMiddleware'
import * as ridesService from '../service/ridesService'
const router = Router();


router.post('/request', authenticate, async (req: any, res: Response, next: NextFunction) => {
    try {
        const trip = await ridesService.requestTrip(req.user.userId, req.body);

        res.status(201).json(trip);
    }
    catch (err) { next(err); }
});

router.post('/:tripId/accept', authenticate, async (req: any, res: Response, next: NextFunction) => {
    try {
        const trip = await ridesService.acceptTrip(req.params.tripId, req.user.userId);

        res.json(trip);
    }
    catch (err) { next(err); }
});

router.patch('/:tripId/status', authenticate, async (req: any, res: Response, next: NextFunction) => {
  try {
    const trip = await ridesService.updateTripStatus(req.params.tripId, req.body.status);
    res.json(trip);
  } catch (err) { next(err); }
});

router.get('/:tripId', authenticate, async (req: any, res: Response, next: NextFunction) => {
    try {
        const trip = await ridesService.getTripById(req.params.tripId);
        res.json(trip);
    }
    catch (err) { next(err); }
});

export default router;


//riderToken:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ijg5ZjI1NzlkLTFjZjctNDU2ZC05MGE3LWQ0ZjJiNjY0ODU3OSJ9.eyJ1c2VySWQiOiJjN2JmNmJjYi1mMDdjLTQzMWYtOWQ5MC1lY2VkOGYxMDM2OTkiLCJlbWFpbCI6InJpZGVyQHRlc3QuY29tIiwicm9sZSI6InJpZGVyIiwiaWF0IjoxNzgzNDM5MDEwLCJleHAiOjE3ODM1MjU0MTB9.Inf7lSqIkYYP5LD2eN2p32deW5nWItSVFgx_y327sB8
// tripId:7c54bf2e-e104-4d69-bb58-ef0134629e7c
//driverToken:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ijg5ZjI1NzlkLTFjZjctNDU2ZC05MGE3LWQ0ZjJiNjY0ODU3OSJ9.eyJ1c2VySWQiOiIxNDNmNmJlMy1mYTY3LTRjZjYtOGM1NC0yYzg2OTg1NWQ4YTEiLCJlbWFpbCI6ImRyaXZlckB0ZXN0LmNvbSIsInJvbGUiOiJkcml2ZXIiLCJpYXQiOjE3ODM0MzkyODYsImV4cCI6MTc4MzUyNTY4Nn0.j3VBSW3vMJJtKjuU_ML8-ZETEe1qjfIXqvxr1SmJsQc