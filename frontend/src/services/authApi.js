import { axiosInstance } from "./api";

export const login = async (data) => {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
};

export const register = async (data) => {
    return await axiosInstance.post("/auth/register", data);
};