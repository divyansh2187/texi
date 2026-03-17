const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const captainController = require('../Controllers/captain.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.post("/register", [
        body("email").isEmail().withMessage("Invalid email"),
        body("fullname.firstname").isLength({ min: 3 }).withMessage("Full name is required"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
        body("vehicle.color").isLength({ min: 3 }).withMessage("Vehicle color is required"),
        body("vehicle.plate").isLength({ min: 3 }).withMessage("Vehicle plate is required"),
        body("vehicle.capacity").isInt({ min: 1 }).withMessage("Vehicle capacity must be a positive number"),
        body("vehicle.vehicleType").isIn(['car', 'motorcycle', 'auto']).withMessage("Vehicle type is required"),
    ],
    captainController.registerCaptain
);

router.post("/login", [
     body("email").isEmail().withMessage("Invalid email"),
      body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
], captainController.loginCaptain )

router.get('/profile' , authMiddleware.authCaptain , captainController.getCaptainProfile);

router.get('/logout' , authMiddleware.authCaptain , captainController.logoutCaptain);

module.exports = router;