const mapApi = require("../config/mapApi");
const axios = require("axios");
const captainModel = require("../models/CaptianModel");




const getAddressCoordinates = async (address) => {
    if (!address?.trim()) {
        throw new Error("Address is required");
    }

    const response = await mapApi.get("/search", {
        params: {
            format: "json",
            q: address,
            limit: 10
        }
    });

    const data = response.data;

    if (!data.length) {
        throw new Error("Address not found");
    }

    return {
        lat: Number(data[0].lat),
        lon: Number(data[0].lon)
    };
};


const getDistanceAndTimeService = async (
  origin,
  destination
) => {

 const originCoords = await getAddressCoordinates(origin);
 const destinationCoords = await getAddressCoordinates(destination);


 const response = await axios.post(
    "https://api.openrouteservice.org/v2/directions/driving-car",
    {
        coordinates: [
            [originCoords.lon, originCoords.lat],
            [destinationCoords.lon, destinationCoords.lat]
        ]
    },
    {
        headers: {
            Authorization: process.env.ORS_API_KEY,
            "Content-Type": "application/json"
        }
    }
);
  
  const routes = response.data.routes[0];
   if (!routes) {
    throw new Error("No route found between the specified locations");
    }
  const summary = routes.summary

  return {
    distance: {
        meters: summary.distance,
        kilometers: (summary.distance / 1000).toFixed(2)
    },

    duration: {
        seconds: summary.duration,
        minutes: Math.ceil(summary.duration / 60)
    },
  
  };
};

const getAddressSuggestions = async (input) => {
    if (!input || !input.trim()) {
        throw new Error("Input parameter is required");
    }

    const response = await mapApi.get("/search", {
        params: {
            format: "json",
            q: input,
            limit: 10,
            addressdetails: 1,
            countrycodes: "in"
        }
    });

    return response.data.map((item) => ({
        place_id: item.place_id, 
        title: item.display_name,
        type: item.type,

        location: {
            lat: Number(item.lat),
            lon: Number(item.lon)
        }
    }));
};

const reverseGeocode = async (lat, lng) => {
    if (!lat || !lng) {
        throw new Error("Latitude and longitude are required");
    }

    const response = await mapApi.get("/reverse", {
        params: {
            format: "json",
            lat: lat,
            lon: lng,
            addressdetails: 1
        }
    });

    return {
        address: response.data.display_name,
        lat: Number(response.data.lat),
        lng: Number(response.data.lon)
    }

};

const getCaptainInRadius = async (lat, lon, radius) => {
    return await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [
                    [lon, lat],
                    radius / 6378.1
                ]
            }
        }
    });

};

module.exports = {
    getAddressCoordinates,
    getDistanceAndTimeService,
    getAddressSuggestions,
    reverseGeocode,
    getCaptainInRadius
};