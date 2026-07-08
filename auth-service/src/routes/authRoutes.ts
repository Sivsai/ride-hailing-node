

import {Request,Response,NextFunction,Router} from 'express'
import * as authService from '../service/authService'
import {authenticate} from '../middleware/authMiddleware'
const router = Router();

router.post('/register', async (req:Request,res:Response,next:NextFunction) =>{

try{
    const user = await authService.register(req.body);
    res.status(201).json(user);
}
catch(err) {next(err);}
});

router.post('/login',async (req:Request,res:Response,next:NextFunction) =>{
try{
    const result = await authService.login(req.body);
    res.json(result);
}
catch(err) {next(err);}
});
router.get('/profile',authenticate,async (req:any,res:Response,next:NextFunction) =>{
try{
    const user = await authService.getProfile(req.user.userId);
    res.json(user);
}
catch(err) {next(err);}
});
export default router;