const rideModel = require("../models/rideModel");
const mapService = require("../services/map.service");
const crypto = require("crypto");
const { sendMessageToSocketID } = require("../socket");
const userModel = require("../models/UserModel");


const fareRates = {
  auto: { baseFare: 15, perKm: 10, perMinute: 0.5 },
  car: { baseFare: 20, perKm: 15, perMinute: 0.5 },
  motorcycle: { baseFare: 10, perKm: 7, perMinute: 0.5 },
};

const getFare = async (pickup, destination, vehicleType = "car") => {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required to calculate fare");
  }
  const distanceAndTime = await mapService.getDistanceAndTimeService(
    pickup,
    destination,
  );
  const rates = fareRates[vehicleType] || fareRates.car;
  const distanceInKm = distanceAndTime.distance.kilometers;
  const durationInMinutes = distanceAndTime.duration.minutes;

  return {
    amount: Math.ceil(
      rates.baseFare +
      distanceInKm * rates.perKm +
      durationInMinutes * rates.perMinute,
    ),
    duration: Math.ceil(durationInMinutes),
    distance: Math.ceil(distanceInKm),
  };
};

const getOTP = (num) => {
  function generateOTP(num) {
    const otp = crypto
      .randomInt(0, Math.pow(10, num))
      .toString()
      .padStart(num, "0");
    return otp;
  }
  return generateOTP(num);
};

module.exports.createRide = async ({
  user,
  pickup,
  destination,
  vehicleType,
  distance,
  duration,
}) => {
  try {
    if (!pickup || !destination) {
      throw new Error("Pickup and destination are required to create a ride");
    }
    const fare = await getFare(pickup, destination, vehicleType);

    const newRide = await rideModel.create({
      userId: user,
      pickup,
      destination,
      fare: fare.amount,
      vehicleType,
      duration: fare.duration,
      distance: fare.distance,
      otp: getOTP(4),
    });

    delete newRide.otp;

    let captains = [];

    try {
      const pickupCoords = await mapService.getAddressCoordinates(pickup);
      captains = await mapService.getCaptainInRadius(
        pickupCoords.lat,
        pickupCoords.lon,
        5,
      );

      captains = captains.filter(
        captain => captain.vehicle.vehicleType === vehicleType
      );
    } catch (err) {
      console.error("Captain search failed:", err.message);
    }

    const ride = await rideModel
      .findById(newRide._id)
      .populate("userId", "fullname email phone")
      .lean();
    delete ride.otp;

    captains.forEach((captain) => {
      sendMessageToSocketID(
        captain.socketId,
        "new-ride",
        ride
      );
    });

    return {
      ride,
      captains,
    };

    return {
      ride,
      captains,
    };
  } catch (error) {
    throw new Error(`Failed to create ride: ${error.message}`);
  }
};

module.exports.confirmRide = async (rideId, captainId) => {
  try {
    if (!rideId) {
      throw new Error("Ride ID is required to confirm a ride");
    }

    // Update ride
    await rideModel.findByIdAndUpdate(
      rideId,
      {
        status: "accepted",
        captainId: captainId,
      },
      { new: true }
    );

    // Get updated ride with populated user & captain
    const ride = await rideModel
      .findById(rideId)
      .select("+otp")
      .populate("userId", "fullname email socketId")
      .populate(
        "captainId",
        "fullname email socketId vehicle status location"
      );

    if (!ride) {
      throw new Error("Ride not found");
    }

    console.log("Ride after confirmation:", ride);

    // Notify user
    if (ride.userId?.socketId) {
      sendMessageToSocketID(
        ride.userId.socketId,
        "ride-confirmed",
        {
          ride,
        }
      );
    }

    return ride;
  } catch (error) {
    throw new Error(`Failed to confirm ride: ${error.message}`);
  }
};


module.exports.getOTP = getOTP;
module.exports.getFare = getFare;
