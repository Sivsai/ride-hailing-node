import client from '../config/redis'

const GEO_KEY = 'drivers:locations';
export const addDriverLocation  = async (driverId:string,lat:number,long:number) =>{
    await client.geoAdd(GEO_KEY,{longitude:long,latitude:lat,member:driverId});   
};
export const removeDriverLocation = async(driverId:string)=>{
    await client.zRem(GEO_KEY,driverId);
    };
export const getNearbyDrivers = async(lat:number,long:number,radiusKm:number) =>{
    return await client.geoSearchWith(GEO_KEY,
        {latitude:lat,longitude:long},
        {radius:radiusKm,unit:'km'},
        ['WITHCOORD','WITHDIST'],
        {SORT:'ASC'}
    );
};

export const getDriverLocation = async (driverId:string) =>{
    const pos = await client.geoPos(GEO_KEY,driverId);
    return pos[0];
}

