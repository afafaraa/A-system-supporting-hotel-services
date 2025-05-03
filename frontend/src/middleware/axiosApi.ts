import axios from "axios";
import { jwtDecode } from "jwt-decode";

const axiosApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_SERVER_URL,
});

const axiosAuthApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_SERVER_URL,
})

const refreshToken = async () => {
    const refresh = localStorage.getItem('REFRESH_TOKEN');
    try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_SERVER_URL}/open/refresh`,
          { token: refresh }
        );
        if (res.data) {
            const { accessToken } = res.data.accessToken;
            localStorage.setItem('ACCESS_TOKEN', accessToken);
            return accessToken;
        }
    } catch (error) {
        console.error("Error refreshing token:", error);
        throw error;
    }
};

const getValidToken = async () => {
    let token = localStorage.getItem('ACCESS_TOKEN');
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp && decoded.exp < now) {
            console.log("Token expired, refreshing...");
            token = await refreshToken();
        }

        return token;
    } catch (err) {
        console.error("Invalid token:", err);
        return null;
    }
};

axiosAuthApi.interceptors.request.use(
  async (config) => {
      const token = await getValidToken();
      if (token) {
          config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
  },
  (error) => console.log(error)
);

export {axiosAuthApi};

export default axiosApi;
