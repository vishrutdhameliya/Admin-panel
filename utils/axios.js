import axios from "axios";

const api = axios.create({
    baseURL: "/api", // Adjust if needed
    headers: { "Content-Type": "application/json" },
});

export default api;
