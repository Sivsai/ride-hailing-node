import {query} from '../config/db'


export const createTrip = async (trip:{
    id:string,
    rider_id:string,
    start_lat:number,
    start_long:number,
    end_lat:number,
    end_long:number,
}) =>{
    const result = await query(
        `INSERT INTO TRIPS(id,rider_id,start_lat,start_long,end_lat,end_long,status)
        VALUES ($1,$2,$3,$4,$5,$6,'requested') RETURNING *
        `,
        [trip.id,trip.rider_id,trip.start_lat,trip.start_long,trip.end_lat,trip.end_long]
    );
    return result.rows[0];
};


export const acceptTrip = async(driverId:string,tripId:string)=>{
    const result = await query(
        `UPDATE trips SET driver_id = $1 , status = 'accepted'
        WHERE id = $2 AND status = 'requested' AND driver_id IS NULL RETURNING *`,
        [driverId,tripId]
    );
        return result.rows[0] || null;

};
export const updateStatus = async (tripId: string, status: string) => {
  const result = await query(
    `UPDATE trips SET status=$1::varchar,
     started_at = CASE WHEN $1::varchar='enroute' THEN NOW() ELSE started_at END,
     ended_at = CASE WHEN $1::varchar='completed' THEN NOW() ELSE ended_at END
     WHERE id=$2::uuid RETURNING *`,
    [status, tripId]
  );
  return result.rows[0];
};


export const getTripById = async(tripId:string) =>{
    const result = await query(
        `SELECT * FROM trips WHERE id = $1`,[tripId]
    );
    return result.rows[0] || null;
};

export const completeTrip = async(tripId:string,fare:number) =>{
  const result =   await query(`
        UPDATE trips SET status = 'completed',ended_at=NOW(), fare = $2 WHERE id = $1 
        RETURNING *`,[tripId,fare]);

        return result.rows[0];
};

export const getActiveTripCount = async()=>{
    const result = await query(`
        SELECT COUNT(*) FROM trips WHERE status IN ('requested','accepted','pickup','enroute')
        `);
        return parseInt(result.rows[0].count);
};
export const getOnlineDriverCount = async()=>{
    const result  = await query(`
        SELECT COUNT(*) FROM drivers WHERE is_Online = true AND is_available = true 
        `);
        return parseInt(result.rows[0].count);
};

export const getDriverById = async (driverId: string) => {
  const result = await query(
    `SELECT * FROM drivers WHERE user_id=$1`,
    [driverId]
  );
  return result.rows[0] || null;
};