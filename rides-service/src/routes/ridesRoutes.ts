

import { Router, Request, Response, NextFunction } from 'express'
import { authenticate } from '../middleware/authMiddleware'
import * as ridesService from '../service/ridesService'
const router = Router();


router.post('/request', authenticate, async (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const result = await ridesService.requestTrip(req.user.userId,{...req.body,token,});
    res.status(201).json(result);
  } catch (err) { next(err); }
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

router.get('/surge',authenticate,async (req:any,res:Response,next:NextFunction) =>{
    try{
        const multiplier = await ridesService.getSurgeMultiplier();
        res.json({surgeMultiplier:multiplier});
    }
    catch(err){next(err);}
})

router.get('/:tripId', authenticate, async (req: any, res: Response, next: NextFunction) => {
    try {
        const trip = await ridesService.getTripById(req.params.tripId);
        res.json(trip);
    }
    catch (err) { next(err); }
});

export default router;


//riderToken:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImM0N2QzODAzLTQ5ZmUtNDdjZC04YmU2LWIwYjM4NzdiNGZiNCJ9.eyJ1c2VySWQiOiJjN2JmNmJjYi1mMDdjLTQzMWYtOWQ5MC1lY2VkOGYxMDM2OTkiLCJlbWFpbCI6InJpZGVyQHRlc3QuY29tIiwicm9sZSI6InJpZGVyIiwiaWF0IjoxNzgzNzcwNjE3LCJleHAiOjE3ODM4NTcwMTd9.Y1OGot1Hh_o1HldV9ssTk2AQYpO_cn0h38z_O2xEuyw
// tripId:2f83b19b-13f9-4982-b28d-f866b8b6c3a6
//driverToken:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImM0N2QzODAzLTQ5ZmUtNDdjZC04YmU2LWIwYjM4NzdiNGZiNCJ9.eyJ1c2VySWQiOiIxNDNmNmJlMy1mYTY3LTRjZjYtOGM1NC0yYzg2OTg1NWQ4YTEiLCJlbWFpbCI6ImRyaXZlckB0ZXN0LmNvbSIsInJvbGUiOiJkcml2ZXIiLCJpYXQiOjE3ODM3NzA2NjQsImV4cCI6MTc4Mzg1NzA2NH0.hUuu9esKZh8kJIVLiKamrLW1D_39TL8veyb-aswX4sg
