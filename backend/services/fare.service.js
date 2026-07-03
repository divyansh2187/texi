const fareRates = {
    auto: { baseFare: 15, perKm: 10, perMinute: 0.5 },
    car: { baseFare: 20, perKm: 15, perMinute: 0.5 },
    motorcycle: { baseFare: 10, perKm: 7, perMinute: 0.5 },
};

const calculateFare = (distanceKm, durationMin) => {
    return {
        motorcycle: Math.ceil(
            fareRates.motorcycle.baseFare +
            distanceKm * fareRates.motorcycle.perKm +
            durationMin * fareRates.motorcycle.perMinute
        ),

        auto: Math.ceil(
            fareRates.auto.baseFare +
            distanceKm * fareRates.auto.perKm +
            durationMin * fareRates.auto.perMinute
        ),

        car: Math.ceil(
            fareRates.car.baseFare +
            distanceKm * fareRates.car.perKm +
            durationMin * fareRates.car.perMinute
        )
    };
};

module.exports = { calculateFare };