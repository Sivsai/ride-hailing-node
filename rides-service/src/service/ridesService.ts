import { v4 as uuidv4 } from 'uuid'
import * as repo from '../repository/ridesRepository'
import { AppError, NotFoundError } from '../middleware/error'

export const requestTrip = async (
    riderId: string,
    body: { start_lat: number, start_long: number, end_lat: number, end_long: number }
) => {
    return await repo.createTrip({ id: uuidv4(), rider_id: riderId, ...body });
};

export const acceptTrip = async (tripId: string,driverId: string) => {

    const trip = await repo.acceptTrip(driverId, tripId);
    if (!trip) throw new AppError('Another driver accepted the trip', 409);
    return trip;
};


export const updateTripStatus = async (
  tripId: string,
  status: 'pickup' | 'enroute' | 'completed' | 'cancelled'
) => {
  const trip = await repo.getTripById(tripId);
  if (!trip) throw new NotFoundError('Trip not found');

  validateTransition(trip.status, status);
  return await repo.updateStatus(tripId, status);
};

const VALID_TRANSITIONS: Record<string, string[]> = {
  requested:  ['accepted', 'cancelled'],
  accepted:   ['pickup', 'cancelled'],
  pickup:     ['enroute'],
  enroute:    ['completed'],
  completed:  [],
  cancelled:  [],
};

const validateTransition = (current: string, next: string) => {
  if (!VALID_TRANSITIONS[current]?.includes(next))
    throw new AppError(`Invalid transition: ${current} → ${next}`, 400);
};

export const getTripById = async (tripId:string)=>{
    const trip  = await repo.getTripById(tripId);
    if(!trip) throw new NotFoundError("Trip not Found")
    return trip;
}