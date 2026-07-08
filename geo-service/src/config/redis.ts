import {createClient} from 'redis'
import dotenv from 'dotenv'

dotenv.config();

const client = createClient(process.env.REDIS_URL ? { url: process.env.REDIS_URL } : undefined);
client.on('error',(err) => console.error("Redis error: ",err));

export const connectRedis =async()=> await client.connect();

export default client;
