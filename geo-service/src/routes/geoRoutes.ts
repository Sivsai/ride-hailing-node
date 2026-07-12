import * as geoService from '../service/geoService'
import { Request, Response, NextFunction, Router } from 'express'
const router = Router();

router.post('/location', async (req: any, res: Response, next: NextFunction) => {
    try {
        const { driverId, lat, long } = req.body;

        await geoService.updateDriverLocation(driverId, lat, long);
        res.json({ message: 'Location Updated' });
    }
    catch (err) { next(err); }

});
router.get('/nearby', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { lat, long, radius } = req.query;

        const drivers = await geoService.findNearbyDrivers(
            parseFloat(lat as string),
            parseFloat(long as string),
            parseFloat(radius as string)
        );
        res.json(drivers);
    }
    catch (err) { next(err) };
});
router.delete('/location/:driverId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await geoService.goOffline(req.params.driverId as string);
        res.json({ message: 'Driver Offline' });
    }
    catch (err) { next(err) };
});
export default router;