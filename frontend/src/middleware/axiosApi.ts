import axios from "axios";
import { store } from "../redux/store";

const axiosApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_SERVER_URL,
});

const axiosAuthApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_SERVER_URL,
})

axiosAuthApi.interceptors.request.use(
  async (config) => {
    const accessToken = store.getState().user.user?.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => console.log(error)
);

export {axiosAuthApi};

export default axiosApi;
