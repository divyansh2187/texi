const mapApi = require("../config/mapApi");

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

module.exports = {
    getAddressCoordinates
};