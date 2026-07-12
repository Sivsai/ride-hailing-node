

import * as ridesRepo from '../repository/ridesRepository';
import * as paymentsRepo from '../repository/paymentsRepository'
import {v4 as uuidv4} from 'uuid'
import {NotFoundError,AppError} from '../middleware/error'
import stripe from '../config/stripe'
export const createPayment = async (tripId:string,riderId:string) =>{

    const trip  = await ridesRepo.getTripById(tripId);
    if(!trip) throw new NotFoundError("Trip not found");
    if(!trip.fare) throw new AppError("Fare not yet calculated",400);

    const intent  = await stripe.paymentIntents.create({
        amount:Math.round(trip.fare*100),
        currency:'usd',
          payment_method: 'pm_card_visa', // Stripe test card
  confirm: true,      
    automatic_payment_methods: {
    enabled: true,
    allow_redirects: "never",
  },
        metadata:{tripId,riderId}
    });

    const payment = await paymentsRepo.createPayment(
        {id:uuidv4(),
        trip_id:tripId,
        rider_id:riderId,
        amount:trip.fare,
        stripe_payment_intent_id:intent.id
    })
    return {payment,clientSecret:intent.client_secret};

};

export const confirmPayment = async (stripPaymentIntentId:string) =>
{
   const intent = await stripe.paymentIntents.retrieve(stripPaymentIntentId);
  const status   = intent.status == 'succeeded'?'succeeded':'failed';

 return await paymentsRepo.updatePaymentStatus(stripPaymentIntentId,status);
}

export const getPaymentByTrip = async(tripId:string) =>{
    const payment = await paymentsRepo.getPaymentByTrip(tripId);
    if(!payment) throw new NotFoundError("Payment Not Found");
    return payment;
}