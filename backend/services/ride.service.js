const rideModel = require('../models/rideModel');
const mapService = require('../services/map.service');

const fareRates = {
    auto: { baseFare: 15, perKm: 10, perMinute: 0.5 },
    car: { baseFare: 20, perKm: 15, perMinute: 0.5 },
    motorcycle: { baseFare: 10, perKm:7, perMinute: 0.5 },
};

const getFare = async (pickup, destination, vehicleType = 'car') => {
    if(!pickup || !destination) {
        throw new Error("Pickup and destination are required to calculate fare");
    }
    const distanceAndTime = await mapService.getDistanceAndTimeService(pickup, destination);
    console.log(distanceAndTime);
    const rates = fareRates[vehicleType] || fareRates.car;
    const distanceInKm = distanceAndTime.distance.kilometers ;
    const durationInMinutes = distanceAndTime.duration.minutes;

    return {
        amount: Math.ceil(
            rates.baseFare +
            (distanceInKm * rates.perKm) +
            (durationInMinutes * rates.perMinute)
        ),
        duration: Math.ceil(durationInMinutes),
        distance: Math.ceil(distanceInKm)
    };
};


module.exports.createRide = async ({user, pickup, destination, vehicleType , distance, duration}) => {
    try {
        if (!pickup || !destination) {
            throw new Error("Pickup and destination are required to create a ride");
        }
        const fare = await getFare(pickup, destination , vehicleType); 
        
        const newRide = await rideModel.create({
            userId: user,
            pickup,
            destination,
            fare: fare.amount,
            duration: fare.duration,
            distance: fare.distance,
        });
        return newRide;
    } catch (error) {
        throw new Error(`Failed to create ride: ${error.message}`);
    }

}
