import express from 'express';
import { query } from './config/db';
import {cleanExpiredKeys} from './keys/keyManager'
import {errorHandler} from './middleware/errorHandler'
import authRoutes from './routes/authRoutes'



const app = express();
app.use(express.json());

app.use('/api/v1/auth',authRoutes);
app.use(errorHandler);

setInterval(cleanExpiredKeys,1000*60*60);



const port  = process.env.PORT||8081;

app.listen(port,()=>  console.log(`listening in the port : ${port}`))