import { v4 as uuidv4 } from 'uuid'
import * as repo from '../repository/ridesRepository'
import { AppError, NotFoundError } from '../middleware/error'
import { calculateDistance, calculateFare, calculateSurge } from '../utils/fareCalculator'
import axios from 'axios'
import { SERVICES } from '../config/services';
import * as paymentServices from './paymentsService'

export const requestTrip = async (
  riderId: string,
  body: {
    start_lat: number;
    start_long: number;
    end_lat: number;
    end_long: number;
    token: string; // forward auth token
  }
) => {
  // Find nearby drivers first
  const { data: nearbyDrivers } = await axios.get(
    `${SERVICES.geo}/api/v1/geo/nearby`,
    {
      params: { lat: body.start_lat, long: body.start_long, radius: 10 },
      headers: { Authorization: `Bearer ${body.token}` }
    }
  );

  if (!nearbyDrivers.length) throw new AppError('No drivers available nearby', 404);

  const trip = await repo.createTrip({
    id: uuidv4(),
    rider_id: riderId,
    start_lat: body.start_lat,
    start_long: body.start_long,
    end_lat: body.end_lat,
    end_long: body.end_long,
  });

  return { trip, nearbyDrivers };
};

export const acceptTrip = async (tripId: string, driverId: string) => {


  const driver = await repo.getDriverById(driverId);
  if (!driver) throw new AppError('Driver profile not found', 404);
  if (!driver.is_available) throw new AppError('Driver is not available', 403);
  if (driver.approval_status !== 'approved') throw new AppError('Driver not approved yet', 403);


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

  if (status === 'completed') {
    const distanceKm = calculateDistance(trip.start_lat, trip.start_long, trip.end_lat, trip.end_long);
    const durationMin = (Date.now() - new Date(trip.started_at).getTime()) / 60000;
    const surgeMultiplier = await getSurgeMultiplier();
    const fare = calculateFare(distanceKm, durationMin, surgeMultiplier);
    const completedTrip = await repo.completeTrip(tripId, fare);

    const payment = await paymentServices.createPayment(tripId, trip.rider_id)
  return { trip: completedTrip, payment };
  }
  return await repo.updateStatus(tripId, status);
};

const VALID_TRANSITIONS: Record<string, string[]> = {
  requested: ['accepted', 'cancelled'],
  accepted: ['pickup', 'cancelled'],
  pickup: ['enroute'],
  enroute: ['completed'],
  completed: [],
  cancelled: [],
};

const validateTransition = (current: string, next: string) => {
  if (!VALID_TRANSITIONS[current]?.includes(next))
    throw new AppError(`Invalid transition: ${current} → ${next}`, 400);
};

export const getTripById = async (tripId: string) => {
  const trip = await repo.getTripById(tripId);
  if (!trip) throw new NotFoundError("Trip not Found")
  return trip;
}

export const getSurgeMultiplier = async (): Promise<number> => {
  const [onlineDrivers, activeTrips] = await Promise.all([
    repo.getOnlineDriverCount(),
    repo.getActiveTripCount()
  ])
  return calculateSurge(activeTrips, onlineDrivers);
}