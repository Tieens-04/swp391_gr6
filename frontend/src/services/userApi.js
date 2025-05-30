import { axiosInstance } from "./api";

export const userManage = async (data) => {
    return await axiosInstance.post("/users/user-manage", data);
}

export const getRegistrationStats = async (data) => {
    return await axiosInstance.post("/users/registration-stats", data);
}