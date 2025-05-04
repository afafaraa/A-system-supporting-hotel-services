import {setUser} from "../../redux/slices/userSlice";
import axiosApi from "../../middleware/axiosApi";
import { jwtDecode } from "jwt-decode";
import {AppDispatch} from "../../redux/store.ts";

interface CustomJwtPayload {
    iat: number,
    exp: number,
    sub: string,
    type: string,
    role: string,
}

function removeTokensFromLocalStorage() {
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('REFRESH_TOKEN');
}

export async function initializeUserFromLocalStorage(dispatch: AppDispatch) {
    const accessToken = localStorage.getItem('ACCESS_TOKEN');
    const refreshToken = localStorage.getItem('REFRESH_TOKEN');
    if (!accessToken || !refreshToken) {
        console.log("No tokens found");
        removeTokensFromLocalStorage();
        return false;
    }
    const currentTime = Date.now() / 1000;
    const accessTokenData = jwtDecode<CustomJwtPayload>(accessToken);
    const refreshTokenData = jwtDecode<CustomJwtPayload>(refreshToken);
    if (!accessTokenData || !refreshTokenData) {
        console.log("Invalid token data");
        removeTokensFromLocalStorage();
        return false;
    }
    if (accessTokenData.exp > currentTime) {
        console.log("Access token valid");
        dispatch(setUser({username: accessTokenData.sub, role: accessTokenData.role, accessToken, refreshToken}));
        return true;
    }
    console.log("Access token expired");
    if (refreshTokenData.exp < currentTime) {
        console.log("Refresh token expired, unable to refresh");
        removeTokensFromLocalStorage();
        return false;
    }
    await handleTokenRefresh(refreshToken, dispatch, accessTokenData);
    console.log("Access token refreshed");
    return true;
}

async function handleTokenRefresh(refreshToken: string, dispatch: AppDispatch, accessTokenData: CustomJwtPayload) {
    try {
        const response = await axiosApi.post('/open/refresh', {refreshToken: refreshToken});
        console.log("Refresh token data:", response)
        if (response.data?.accessToken) {
            const newAccessToken: string = response.data.accessToken;
            localStorage.setItem('ACCESS_TOKEN', newAccessToken);
            dispatch(setUser({
                username: accessTokenData.sub,
                role: accessTokenData.role,
                accessToken: newAccessToken,
                refreshToken
            }));
            return true;
        } else {
            console.log("No data received from refresh token request");
            return false;
        }
    } catch (error) {
        console.log("Unable to refresh token:", error);
        removeTokensFromLocalStorage();
        return false;
    }
}
