import axios from "axios";

const axiosApi = axios.create({
    baseURL: "http://localhost:8081"
});

export default axiosApi;