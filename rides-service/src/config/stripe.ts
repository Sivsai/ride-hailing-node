import Stripe from 'stripe'
import dotenv from 'dotenv'


dotenv.config();

const stripe: Stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16' as any
});

export default stripe;