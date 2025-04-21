import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { selectUser, setUser } from "../../redux/slices/userSlice";
import axiosApi from "../../middleware/axiosApi";
import { jwtDecode } from "jwt-decode";

export default function useAuthenticateOnFrontend() {
    const dispatch = useDispatch();
    const isAuthorized = useSelector(selectUser);  // Get current authorization status

    useEffect(() => {
        const refreshToken = async () => {
            const refresh = localStorage.getItem('REFRESH_TOKEN');
            try {
                const res = await axiosApi.post(
                    '/refresh-token',
                    {
                        token: refresh
                    }
                );
                console.log("Refresh token data: ",res)
                if (res.data) {
                    const decoded = jwtDecode(res.data.accessToken);
                    console.log(decoded)
                    localStorage.setItem('ACCESS_TOKEN', res.data.accessToken)
                    dispatch(setUser({isAuthorized: true}))
                } else {
                    dispatch(setUser({isAuthorized: false}))
                }
            } catch (error) {
                console.log(error);
                dispatch(setUser({isAuthorized: false}));
            }
        };

        const auth = async () => {
            const token = localStorage.getItem('ACCESS_TOKEN');
            console.group("Authenticate")
            console.log("Access token received:", token);

            if (!token) {
                dispatch(setUser({isAuthorized: false}));
                console.groupEnd()
                return;
            }

            try {
                const decoded = jwtDecode(token);
                const tokenExpiration = decoded.exp;
                const now = Date.now() / 1000;
                console.log("Access token data: ",decoded, tokenExpiration, now);

                if (tokenExpiration < now) {
                    console.log("Access token expired. Refreshing...");
                    await refreshToken()
                } else {
                    console.log("Access token valid");
                    dispatch(setUser({isAuthorized: true}));
                }
            } catch (error) {
                console.error("Failed to decode access token:", error);
                dispatch(setUser({isAuthorized: false}));
            }
            console.groupEnd()
        };

        auth();
    }, [dispatch]);

    return isAuthorized;
}
