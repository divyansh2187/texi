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
    pickupCoordinates,
    destination,
    vehicleType,
    distance,
    duration,
}) => {
    try {
        if (!pickup || !destination) {
            throw new Error("Pickup and destination are required to create a ride");
        }

        if (
            !pickupCoordinates ||
            !Number.isFinite(Number(pickupCoordinates.lat)) ||
            !Number.isFinite(Number(pickupCoordinates.lng)) ||
            Number(pickupCoordinates.lat) < -90 ||
            Number(pickupCoordinates.lat) > 90 ||
            Number(pickupCoordinates.lng) < -180 ||
            Number(pickupCoordinates.lng) > 180
        ) {
            throw new Error("Valid passenger GPS coordinates are required");
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
            pickupCoordinates: {
                lat: Number(pickupCoordinates.lat),
                lng: Number(pickupCoordinates.lng),
            },
        });

        delete newRide.otp;

        let captains = [];

        try {
            captains = await mapService.getCaptainInRadius(
  Number(pickupCoordinates.lat),
  Number(pickupCoordinates.lng),
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

    } catch (error) {
        throw new Error(`Failed to create ride: ${error.message}`);
    }
};


module.exports.confirmRide = async (rideId, captainId) => {
    try {
        const ride = await rideModel
            .findByIdAndUpdate(
                rideId,
                {
                    status: "accepted",
                    captainId: captainId,
                },
                { new: true }
            )
            .select("+otp")
            .populate("userId", "fullname email socketId")
            .populate(
                "captainId",
                "fullname email socketId vehicle status location"
            );

        if (!ride) {
            const error = new Error("Ride not found");
            error.statusCode = 404;
            throw error;
        }

        const rideData = ride.toObject();

        // Send OTP to passenger through their socket
        if (rideData.userId?.socketId) {
            sendMessageToSocketID(
                rideData.userId.socketId,
                "ride-confirmed",
                { ride: rideData }
            );
        }

        // Never return the passenger's OTP to the captain
        delete rideData.otp;

        return rideData;

    } catch (error) {
        throw error;
    }
};


module.exports.startRide = async (rideId, captainId, otp) => {
    try {
        const ride = await rideModel
            .findById(rideId)
            .select("+otp")
            .populate("userId", "fullname email socketId");

        if (!ride) {
            const error = new Error("Ride not found");
            error.statusCode = 404;
            throw error;
        }

        if (String(ride.captainId) !== String(captainId)) {
            const error = new Error("You are not authorized for this ride");
            error.statusCode = 403;
            throw error;
        }

        if (ride.status !== "accepted") {
            const error = new Error("Ride is not in accepted status");
            error.statusCode = 400;
            throw error;
        }

        // Atomic verification: OTP can only be used once
        const updatedRide = await rideModel.findOneAndUpdate(
            {
                _id: rideId,
                captainId: captainId,
                status: "accepted",
                otp: otp,
            },
            {
                $set: {
                    status: "ongoing",
                    startedAt: new Date(),
                },
                $unset: {
                    otp: 1,
                },
            },
            {
                new: true,
            }
        )
            .populate("userId", "fullname email socketId")
            .populate(
                "captainId",
                "fullname email socketId vehicle"
            );

        if (!updatedRide) {
            const error = new Error("Invalid OTP or ride already started");
            error.statusCode = 400;
            throw error;
        }

        const rideData = updatedRide.toObject();

        // Notify passenger that the ride has started
        if (rideData.userId?.socketId) {
            sendMessageToSocketID(
                rideData.userId.socketId,
                "ride-started",
                { ride: rideData }
            );
        }

        return rideData;

    } catch (error) {
        throw error;
    }
};


module.exports.completeRide = async (rideId, captainId) => {
    const ride = await rideModel.findOneAndUpdate(
        {
            _id: rideId,
            captainId: captainId,
            status: "ongoing",
        },
        {
            $set: {
                status: "completed",
                completedAt: new Date(),
            },
        },
        {
            new: true,
        }
    )
        .populate("userId", "fullname email socketId")
        .populate("captainId", "fullname email vehicle");

    if (!ride) {
        const error = new Error(
            "Ride not found, not assigned to you, or not ongoing"
        );
        error.statusCode = 400;
        throw error;
    }

    const rideData = ride.toObject();

    // Notify passenger
    if (rideData.userId?.socketId) {
        sendMessageToSocketID(
            rideData.userId.socketId,
            "ride-completed",
            { ride: rideData }
        );
    }

    return rideData;
};




module.exports.getOTP = getOTP;
module.exports.getFare = getFare;
