import * as geoRepo from '../repository/geoRepository'

export const updateDriverLocation = async (driverId:string,lat:number,long:number) =>{
    await geoRepo.addDriverLocation(driverId,lat,long);
}
export const findNearbyDrivers = async (lat:number,long:number,radiusKm:number) =>{
    const drivers = await geoRepo.getNearbyDrivers(lat,long,radiusKm);
    if(!drivers.length) throw new Error("No drivers available nearby");
    return drivers;
}
export const goOffline = async (driverId:string)=>{
    await geoRepo.removeDriverLocation(driverId);
}
export const getLocation = async (driverId:string)=>{
    const loc =  await geoRepo.getDriverLocation(driverId);
    if(!loc) throw new Error("Driver Location Not found");
    return loc;
};
