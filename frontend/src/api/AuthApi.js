import axiosInstance from "./axiosInstance";


export const registerUser = async(userdata) => {
    const response = await axiosInstance.post("/users/register", userdata);
    return response.data
}


export const LoginUser = async(UserData) =>{
    const response = await axiosInstance.post("/users/login",UserData);
    return response.data
}

