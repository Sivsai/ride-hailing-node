

const BASE = 2.0;
const PER_KM_RATE = 1.5;
const PER_MIN_RATE = 0.25

export const calculateDistance = (
    startLat: number, startLong: number,
    endLat: number, endLong: number
): number => {
    const R = 6371;
    const dLat = toRad(endLat - startLat);
    const dLong = toRad(endLong - startLong);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(startLat)) * Math.cos(toRad(endLat)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}
const toRad = (deg: number) => deg * (Math.PI / 180);

export const calculateFare = (
    distanceKm: number,
    durationMin: number,
    surgeMultiplier = 1.0,
): number => {
    const base = BASE + (distanceKm * PER_KM_RATE) + (durationMin * PER_MIN_RATE);
    return parseFloat((base * surgeMultiplier).toFixed(2));
}


const MAX_MULTIPLIER = 3;
const BASE_MULTIPLIER = 1;
export const calculateSurge = (
    activeTrips: number, onlineDrivers: number
):number => {
    if (onlineDrivers == 0) return MAX_MULTIPLIER;


    const ratio = activeTrips / onlineDrivers;

    if (ratio < 0.5) return BASE_MULTIPLIER;
    else if (ratio < 1.0) return 1.5;
    else if (ratio < 1.5) return 2.0;
    else if (ratio < 2.0) return 2.5;
    else return MAX_MULTIPLIER;
};