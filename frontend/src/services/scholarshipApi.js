import { axiosInstance } from "./api";

export const getAllScholarships = async () => {
    return await axiosInstance.post("/scholarships/get-all");
}