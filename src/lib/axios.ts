import axios, {AxiosInstance, InternalAxiosRequestConfig} from "axios";
import CryptoJS from 'crypto-js';
import {KEY_COOKIES} from "./constants/auth.constants";
import {getClientCookie} from "./cookies.client";

const API_KEY: string = process.env.NEXT_PUBLIC_API_KEY || 'ayNtgOua1gBEsPIki3R8';

interface AxiosInstanceOptions {
    formData?: boolean;
}

const axiosInstance = (options: AxiosInstanceOptions = {}): AxiosInstance => {
    const { formData = false } = options;
    const headers: Record<string, string> = {
        'Content-Type': formData ? 'multipart/form-data' : 'application/json'
    };

    const instance: AxiosInstance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        timeout: 10000,
        headers
    });

    instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        const token: string = getClientCookie(KEY_COOKIES.TOKEN) ?? '';

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        const time: number = Date.now();
        const secret: string = CryptoJS.MD5(time + API_KEY).toString();
        const TIME_AUTH: string = btoa(time.toString());
        config.headers['key'] = secret;
        config.headers['time'] = TIME_AUTH;

        return config;
    }, error => {
        return Promise.reject(error);
    });

    return instance;
};

export default axiosInstance;