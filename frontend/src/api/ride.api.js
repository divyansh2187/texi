import axiosInstance  from "./axiosInstance";

export const createRide = async (rideData) => {
    const { data } = await axiosInstance.post("/ride/create", rideData);
    return data;
};