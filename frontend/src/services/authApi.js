import { axiosInstance } from "./api";

export const sendOtp = async (data) => {
    return await axiosInstance.post("/auth/send-otp", data );
}

export const verifyOtp = async (data) => {
    return await axiosInstance.post("/auth/verify-otp", data);
}

export const register = async (data) => {
    return await axiosInstance.post("/auth/register", data);
};

export const login = async (data) => {
    return await axiosInstance.post("/auth/login", data);
};