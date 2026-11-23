const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
        const ride = await rideService.createRide({
            user: req.user._id,
            pickup: req.body.pickup,
            pickupCoordinates: req.body.pickupCoordinates,
            destination: req.body.destination,
            destinationCoordinates: req.body.destinationCoordinates,
            vehicleType: req.body.vehicleType
        });
        return res.status(201).json({ success: true, data: ride });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    try {
        const ride = await rideService.confirmRide(
            req.params.rideId,
            req.captain._id
        );

        return res.status(200).json({
            success: true,
            data: ride
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    try {
        const ride = await rideService.startRide(
            req.params.rideId,
            req.captain._id,
            req.body.otp
        );

        return res.status(200).json({
            success: true,
            message: "Ride started successfully",
            data: ride
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports.completeRide = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    try {
        const ride = await rideService.completeRide(
            req.params.rideId,
            req.captain._id
        );

        return res.status(200).json({
            success: true,
            message: "Ride completed successfully",
            data: ride
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};


