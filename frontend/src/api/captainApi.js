import axiosInstance from "./axiosInstance";

export const registerCaptain = async (captainData) =>{
    const response = await axiosInstance.post("/captain/register", captainData);
    return response.data;
}

export const loginCaptain = async (captainData) =>{
    const response = await axiosInstance.post("/captain/login", captainData);
    return response.data;
}