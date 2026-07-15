import express from 'express';
import { query } from './config/db';
import { Response, NextFunction } from 'express';
import ridesRoutes from './routes/ridesRoutes'
import paymentRoutes from './routes/paymentRoutes'
import { errorHandler } from './middleware/errorHandler'
import http from 'http'
import {initSocket} from './config/socket'
import trackingRoutes from './routes/trackingRoutes';

const app = express();
const server = http.createServer(app);
initSocket(server);


app.use(express.json())
app.use('/health',(req:any,res:Response,next:NextFunction)=>{
 res.json({status:"healthy"})
 next();   
});
app.use('/api/v1/rides', ridesRoutes);
app.use('/api/v1/payments',paymentRoutes);
app.use('/api/v1/tracking', trackingRoutes);
app.use(errorHandler)


const port = process.env.PORT;

server.listen(port, () => console.log(`RidesService on  port: ${port}`));