import axios from "axios";

const api = axios.create({
    baseURL: "http://sparepart-management.test/api/v1",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

export default api;
