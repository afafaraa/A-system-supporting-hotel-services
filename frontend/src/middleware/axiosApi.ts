import axios from "axios";
import { store } from "../redux/store";
import {handleTokenRefresh} from "../components/auth/auth.tsx";

const axiosApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_SERVER_URL,
});

const axiosAuthApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_SERVER_URL,
})

axiosAuthApi.interceptors.request.use(
  async (config) => {
    const user = store.getState().user.user;
    if (!user) {
      return config;
    }
    const currentTime = Date.now() / 1000;
    if (user.accessTokenExp < currentTime) {
      console.log("Access token expired");
      if (user.refreshTokenExp < currentTime) {
        console.log("Refresh token expired");
        return config;
      } else {
        const token: string | null = await handleTokenRefresh(user.refreshToken);
        // todo
      }
    }
    config.headers.Authorization = `Bearer ${user.accessToken}`;
    return config;
  },
  (error) => console.log(error)
);

export {axiosAuthApi};

export default axiosApi;
