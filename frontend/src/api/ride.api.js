import axiosInstance  from "./axiosInstance";

export const createRide = async (rideData) => {
    const { data } = await axiosInstance.post("/ride/create", rideData);
    return data;
};

export const confirmRide = async(rideId) => {
    const { data } = await axiosInstance.post(`/ride/${rideId}/confirm`);
    return data;
};

export const startRide = async (rideId, otp) => {
    const { data } = await axiosInstance.post(
        `/ride/${rideId}/start`,
        { otp }
    );

    return data;
};

export const completeRide = async (rideId) => {
    const { data } = await axiosInstance.post(
        `/ride/${rideId}/complete`
    );

    return data;
};

