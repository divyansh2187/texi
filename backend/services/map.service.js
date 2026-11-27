const mapApi = require("../config/mapApi");
const axios = require("axios");
const captainModel = require("../middlewares/models/CaptianModel");




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



const getDistanceAndTimeService = async (origin, destination) => {
    const originCoords = await getAddressCoordinates(origin);
    const destinationCoords = await getAddressCoordinates(destination);

    const response = await axios.post(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        {
            coordinates: [
                [originCoords.lon, originCoords.lat],
                [destinationCoords.lon, destinationCoords.lat],
            ],
        },
        {
            headers: {
                Authorization: process.env.ORS_API_KEY,
                "Content-Type": "application/json",
                Accept: "application/geo+json",
            },
        }
    );

    const route = response.data.features?.[0];

    if (!route) {
        throw new Error("No route found between the specified locations");
    }

    const summary = route.properties.summary;

    // ORS returns [longitude, latitude].
    // Leaflet expects [latitude, longitude].
    const routeCoordinates = route.geometry.coordinates.map(
        ([longitude, latitude]) => [latitude, longitude]
    );


    return {
        distance: {
            meters: summary.distance,
            kilometers: (summary.distance / 1000).toFixed(2),
        },

        duration: {
            seconds: summary.duration,
            minutes: Math.ceil(summary.duration / 60),
        },

        pickupCoordinates: {
            lat: originCoords.lat,
            lng: originCoords.lon,
        },

        destinationCoordinates: {
            lat: destinationCoords.lat,
            lng: destinationCoords.lon,
        },

        routeCoordinates,
    };

};



const getRouteBetweenCoordinates = async (
  originLat,
  originLng,
  destinationLat,
  destinationLng
) => {
  const coordinates = [
    originLat,
    originLng,
    destinationLat,
    destinationLng,
  ];

  if (
    coordinates.some((value) => !Number.isFinite(Number(value))) ||
    Number(originLat) < -90 ||
    Number(originLat) > 90 ||
    Number(destinationLat) < -90 ||
    Number(destinationLat) > 90 ||
    Number(originLng) < -180 ||
    Number(originLng) > 180 ||
    Number(destinationLng) < -180 ||
    Number(destinationLng) > 180
  ) {
    throw new Error("Valid GPS coordinates are required");
  }

  const response = await axios.post(
    "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
    {
      coordinates: [
        [Number(originLng), Number(originLat)],
        [Number(destinationLng), Number(destinationLat)],
      ],
    },
    {
      headers: {
        Authorization: process.env.ORS_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/geo+json",
      },
    }
  );

  const route = response.data.features?.[0];

  if (!route) {
    throw new Error("No route found");
  }

  const summary = route.properties.summary;

  return {
    distance: {
      meters: summary.distance,
      kilometers: (summary.distance / 1000).toFixed(2),
    },
    duration: {
      seconds: summary.duration,
      minutes: Math.ceil(summary.duration / 60),
    },
    routeCoordinates: route.geometry.coordinates.map(
      ([longitude, latitude]) => [latitude, longitude]
    ),
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
    getCaptainInRadius,
    getRouteBetweenCoordinates
};