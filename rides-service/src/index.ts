import express from 'express';
import { query } from './config/db';
import { Response, NextFunction } from 'express';
import ridesRoutes from './routes/ridesRoutes'
import paymentRoutes from './routes/paymentRoutes'
import { errorHandler } from './middleware/errorHandler'
const app = express();
app.use(express.json())
app.use('/api/v1/rides', ridesRoutes);
app.use('/api/v1/payments',paymentRoutes);
app.use(errorHandler)


const port = process.env.PORT;

app.listen(port, () => console.log(`Listening to the port: ${port}`));