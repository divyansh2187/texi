 const express = require('express');
 const router = express.Router();
 const {body , param} = require('express-validator');
const rideController = require('../controllers/ride.controller');
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





 module.exports = router;