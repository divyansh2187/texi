import axiosInstance from './axiosInstance';

export const getRideEstimate = async (origin, destination) => {
    const { data } = await axiosInstance.get('/map/get-distance&time',{
        params: { origin, destination }
    });
    return data;
};
