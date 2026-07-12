
import {query} from '../config/db'
export const createPayment = async (payment:{
    id:string,
    trip_id:string,
    rider_id:string,
    amount:number,
    stripe_payment_intent_id:string
}) =>{

    const result = await query(`
        INSERT INTO payments(id,trip_id,rider_id,amount,stripe_payment_intent_id) 
        VALUES($1,$2,$3,$4,$5) RETURNING *
        `,[payment.id,payment.trip_id,payment.rider_id,
        payment.amount,payment.stripe_payment_intent_id]);
    return result.rows[0];
};

export const updatePaymentStatus = async(stripePaymentIntentId:string,status:string) =>{
    const result = await query(`UPDATE payments SET status =$1  WHERE stripe_payment_intent_id = $2
        RETURNING *`,
        [status,stripePaymentIntentId]
    );
    return result.rows[0];
};
export const getPaymentByTrip = async (tripId:string) =>{
    const result = await query(`SELECT * FROM payments WHERE trip_id = $1`,[tripId]);
    return result.rows[0]||null;
};