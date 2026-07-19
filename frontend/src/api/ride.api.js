import axiosInstance  from "./axiosInstance";

export const createRide = async (rideData) => {
    const { data } = await axiosInstance.post("/ride/create", rideData);
    return data;
};

export const confirmRide = async(rideId) => {
    const { data } = await axiosInstance.post(`/ride/${rideId}/confirm`);
    return data;
};