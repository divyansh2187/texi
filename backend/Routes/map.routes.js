const express = require("express");
const router = express.Router();

const mapController = require("../controllers/map.controller");
const validate = require("../middlewares/validation.middleware");
const { addressSchema } = require("../validator/map.validator");
const { authUser } = require("../middlewares/auth.middleware");

router.get(
    "/coordinates",
    authUser ,
    validate(addressSchema),
    mapController.getCoordinates
);

router.get("/test", (req, res) => {
    res.send("Map routes working");
});

router.get("/get-distance&time", mapController.getDistanceAndTime);

router.get("/suggestions",mapController.getAddressSuggestions);

router.get("/reverse-geocode", mapController.reverseGeocode);

module.exports = router;