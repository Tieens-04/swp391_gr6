import axios from "axios";

const API_BASE = "http://localhost:8080/api";

export const getData = async () => {
    const response = await axios.get(`${API_BASE}/products`);
    return response.data;
};