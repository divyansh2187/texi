const express = require('express');
const router = express.Router();
const {body , param} = require('express-validator');
const rideController = require('../Controllers/ride.controller');
const {authUser , authCaptain } = require('../middlewares/auth.middleware');


 

router.post('/create',
    authUser,
    body('pickup').isString().isLength({ min: 3 }).withMessage('invalid pickup location'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination'),
    body('vehicleType').isIn(['auto', 'car', 'motorcycle']).withMessage('Invalid vehicle type'),
    rideController.createRide
)

router.post('/:rideId/confirm', authCaptain,
    param("rideId").isMongoId().withMessage('Invalid ride ID'),
     rideController.confirmRide,
)

router.post(
    '/:rideId/start',
    authCaptain,
    param("rideId").isMongoId().withMessage("Invalid ride ID"),
    body("otp")
        .isString()
        .matches(/^\d{4}$/)
        .withMessage("OTP must be exactly 4 digits"),
    rideController.startRide
);


router.post(
    '/:rideId/complete',
    authCaptain,
    param("rideId").isMongoId().withMessage("Invalid ride ID"),
    rideController.completeRide
);






 module.exports = router;