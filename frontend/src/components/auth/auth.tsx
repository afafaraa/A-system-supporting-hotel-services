import {clearUser, setUser, UserData} from "../../redux/slices/userSlice";
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
    if (accessTokenData.exp > currentTime + 30) {
        console.log("Access token valid");
        dispatch(setUser({
            username: accessTokenData.sub,
            role: accessTokenData.role,
            accessToken: accessToken,
            accessTokenExp: accessTokenData.exp,
            refreshToken: refreshToken,
            refreshTokenExp: refreshTokenData.exp,
        }));
        return true;
    }
    console.log("Access token expired");
    if (refreshTokenData.exp + 10 < currentTime) {
        console.log("Refresh token expired, unable to refresh");
        removeTokensFromLocalStorage();
        return false;
    }
    const newAccessToken: string | null = await handleTokenRefresh(refreshToken);
    if (newAccessToken) {
        const newAccessTokenData = jwtDecode<CustomJwtPayload>(newAccessToken);
        localStorage.setItem('ACCESS_TOKEN', newAccessToken);
        dispatch(setUser({
            username: accessTokenData.sub,
            role: accessTokenData.role,
            accessToken: newAccessToken,
            accessTokenExp: newAccessTokenData.exp,
            refreshToken: refreshToken,
            refreshTokenExp: refreshTokenData.exp,
        }));
        console.log("Access token refreshed");
        return true;
    }
    return false;
}

export async function handleTokenRefresh(refreshToken: string): Promise<string | null> {
    try {
        const response = await axiosApi.post('/open/refresh', {refreshToken: refreshToken});
        console.log("Refresh token data:", response)
        if (response.data?.accessToken) {
            return response.data.accessToken;
        } else {
            console.log("No data received from refresh token request");
            return null;
        }
    } catch (error) {
        console.log("Unable to refresh token:", error);
        removeTokensFromLocalStorage();
        return null;
    }
}

export function updateUserDataAccessToken(user: UserData, newAccessToken: string, dispatch: AppDispatch) {
    localStorage.setItem('ACCESS_TOKEN', newAccessToken);
    const accessTokenData = jwtDecode<CustomJwtPayload>(newAccessToken);
    dispatch(setUser({
        ...user,
        accessToken: newAccessToken,
        accessTokenExp: accessTokenData.exp,
    }))
    console.log("Access token refreshed");
}

export function setUserData(accessToken: string, refreshToken: string, dispatch: AppDispatch) {
    localStorage.setItem('ACCESS_TOKEN', accessToken)
    localStorage.setItem('REFRESH_TOKEN', refreshToken)
    const accessTokenData = jwtDecode<CustomJwtPayload>(accessToken);
    const refreshTokenData = jwtDecode<CustomJwtPayload>(refreshToken);
    dispatch(setUser({
        username: accessTokenData.sub,
        role: accessTokenData.role,
        accessToken: accessToken,
        accessTokenExp: accessTokenData.exp,
        refreshToken: refreshToken,
        refreshTokenExp: refreshTokenData.exp,
    }))
}

export function logoutUser(dispatch: AppDispatch) {
    removeTokensFromLocalStorage();
    dispatch(clearUser());
}
