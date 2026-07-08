import express from 'express'
import {connectRedis} from './config/redis'
import geoRoutes from './routes/geoRoutes'
const app = express();

app.use(express.json());

app.use('/api/v1/geo',geoRoutes);    


const start =  async ()=>{
    await connectRedis();

    console.log("Redis Connected");

    app.listen(process.env.PORT,()=>console.log(`GeoService is Listening on ${process.env.PORT}`));
};
start();