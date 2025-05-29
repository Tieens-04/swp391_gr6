import { axiosInstance } from "./api";

export const getAllScholarships = async (data) => {
    return await axiosInstance.post("/scholarships/get-all", data);
}