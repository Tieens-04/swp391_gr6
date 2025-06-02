import { axiosInstance } from "./api";

export const seekerProfile = async (data) => {
    return await axiosInstance.post("/seeker/profile", data);
}