import {Request,Response,NextFunction} from 'express'
import {AppError} from './error'
export const errorHandler = (err:any,req:Request,res:Response,next:NextFunction)=>{
    if(err instanceof AppError){
        return res.status(err.statusCode).json({error:err.message});
    }
    console.log(err);
    return res.status(500).json({error:"Internal Server Error"});
}