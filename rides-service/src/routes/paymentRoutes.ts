import {Router,Request,Response,NextFunction} from 'express'

import * as paymentsService from '../service/paymentsService'
import {authenticate} from '../middleware/authMiddleware'

const router = Router();
router.post('/intent',authenticate,async (req:any,res:Response,next:NextFunction) =>{
    
    try{
        const {tripId}  = req.body;

    const result = await paymentsService.createPayment(tripId,req.user.userId);
    res.status(201).json(result);

    }
    catch(err) {next(err)};

});
router.post('/confirm',authenticate,async(req:any,res:Response,next:NextFunction) =>{
    try{
        const {stripePaymentIntentId} = req.body;

        const payment = await paymentsService.confirmPayment(stripePaymentIntentId);

        res.json(payment);
    }
    catch(err) {next(err)};
});
router.get('/trip/:tripId',authenticate,async(req:any,res:Response,next:NextFunction)=>{
    try{
        const payment = await paymentsService.getPaymentByTrip(req.params.tripId);
        res.json(payment);
    }catch(err) {next(err)};
});
export default router;