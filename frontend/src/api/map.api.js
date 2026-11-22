import axiosInstance from './axiosInstance';

export const getRideEstimate = async (origin, destination) => {
    const { data } = await axiosInstance.get('/map/get-distance&time',{
        params: { origin, destination }
    });
    return data;
};


export const getCaptainRoute = async (origin, destination) => {
    const { data } = await axiosInstance.get("/map/captain-route", {
        params: {
            originLat: origin.lat,
            originLng: origin.lng,
            destinationLat: destination.lat,
            destinationLng: destination.lng,
        },
    });

    return data;
};
