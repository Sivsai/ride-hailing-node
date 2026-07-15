import express from 'express'
import {connectRedis} from './config/redis' 
import geoRoutes from './routes/geoRoutes'
import {Response,NextFunction} from 'express'
const app = express();

app.use(express.json());
app.use('/health',(req:any,res:Response,next:NextFunction)=>{
 res.json({status:"healthy"})
 next();   
});
app.use('/api/v1/geo',geoRoutes);    


const start =  async ()=>{
    await connectRedis();

    console.log("Redis Connected");

    app.listen(process.env.PORT,()=>console.log(`GeoService is Listening on ${process.env.PORT}`));
};
start();