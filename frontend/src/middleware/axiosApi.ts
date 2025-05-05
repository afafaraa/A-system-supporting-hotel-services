import axios from "axios";
import { store } from "../redux/store";
import {handleTokenRefresh, updateUserDataAccessToken} from "../components/auth/auth.tsx";

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

const axiosApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_SERVER_URL,
});

const axiosAuthApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_SERVER_URL,
})

axiosAuthApi.interceptors.request.use(
  async (config) => {
    const user = store.getState().user.user;
    if (user === null) {
      throw new AuthenticationError("User is null");
    }
    const currentTime = Date.now() / 1000;
    if (user.accessTokenExp > currentTime) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
      return config;
    }
    console.log("Access token expired");
    if (user.refreshTokenExp < currentTime) {
      console.log("Refresh token expired");
      throw new AuthenticationError("Refresh token expired");
    }
    const token: string | null = await handleTokenRefresh(user.refreshToken);
    if (token === null) {
      console.log("Unable to refresh token");
      throw new AuthenticationError("Unable to refresh token");
    }
    updateUserDataAccessToken(user, token, store.dispatch)
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => console.log(error)
);

export {axiosAuthApi};

export default axiosApi;
