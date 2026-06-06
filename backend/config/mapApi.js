const axios = require("axios");

const mapApi = axios.create({
    baseURL: process.env.NOMINATIM_BASE_URL,
    timeout: 5000,
    headers: {
        "User-Agent": "RideBookingApp/1.0"
    }
});

module.exports = mapApi;