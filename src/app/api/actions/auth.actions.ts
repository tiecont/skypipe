import { IVerifyLogin } from "@/lib/models/auth.model";
import { IServerResponse } from "@/lib/models/response.model";
import { setClientCookie } from "@/lib/cookies.client";
import { KEY_COOKIES } from "@/lib/constants/auth.constants";
import axios, { AxiosResponse, HttpStatusCode } from "axios";
import { getInfoUser, verifyLogin } from "@/services/axios";
import { encryptData, MONTH_COOKIE_EXPIRY } from "@/lib/helper";
import {UserModel} from "@/lib/constants/user.constants";

interface TokenData {
    access_token: string;
    refresh_token: string;
}

export interface HandleResponse {
    success: boolean;
    message: string;
}

export const handleLogin = async (
    payload: IVerifyLogin
): Promise<HandleResponse> => {
    try {
        const response: AxiosResponse = await verifyLogin(payload);
        const res: IServerResponse<TokenData> = response.data;

        if (
            res.status.code !== HttpStatusCode.Ok ||
            !res.data?.access_token
        ) {
            return {
                success: false,
                message: res?.status?.message || "Unauthorized",
            };
        }

        setClientCookie(KEY_COOKIES.TOKEN, res.data.access_token, { days: 3 });
        setClientCookie(KEY_COOKIES.REFRESH_TOKEN, res.data.refresh_token, { days: 7 });

        const userResponse: AxiosResponse = await getInfoUser();
        const userReponseData: IServerResponse<UserModel> = userResponse.data;

        if (
            userReponseData.status.code !== HttpStatusCode.Ok ||
            !userReponseData.data
        ) {
            return {
                success: false,
                message: userReponseData?.status?.message || "Failed to retrieve user info",
            };
        }

        const dataInfoUser = JSON.stringify(userReponseData.data);
        const encryptInfoUser = encryptData(dataInfoUser);

        setClientCookie(KEY_COOKIES.USER, encryptInfoUser, {
            days: MONTH_COOKIE_EXPIRY,
        });

        return {
            success: true,
            message: res?.status?.message || "Success",
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                message: error?.response?.data?.message || error.message || "Login error",
            };
        }

        return {
            success: false,
            message: "An unexpected error occurred",
        };
    }
};
