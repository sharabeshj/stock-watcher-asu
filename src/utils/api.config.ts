import {AxiosRequestConfig} from "axios";

export const apiConfig: AxiosRequestConfig = {
    method: 'GET',
    timeout: 30000,
    baseURL: "https://finnhub.io/api/v1/",
    headers: {
        "Cache-Control" : "no-cache, no-store, must-revalidate",
        "Content-Type" : "application/json",
        "Accept" : "application/json",
    },
    params: {
        token: "c9kcp3qad3i81ufrsg9g"
    }
}