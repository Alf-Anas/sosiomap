import { getCookie } from 'cookies-next';
import axios from 'axios';
import { COOKIE } from '@/utils/constant';

const HOST = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

/// request interceptors
HOST.interceptors.request.use(
    (config) => {
        const tokenCookie = getCookie(COOKIE.TOKEN);
        if (tokenCookie) {
            config.headers['Authorization'] = 'Bearer ' + tokenCookie;
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    },
);

const API = {
    getPublicChat: (
        lat: number,
        lon: number,
        channel: string,
        distance?: number,
    ) =>
        HOST.get(`chats`, {
            params: {
                lon,
                lat,
                channel,
                distance,
            },
        }),

    postChat: (lat: number, lon: number, channel: string, body: string) =>
        HOST.post(`chats`, {
            body,
            channel,
            lat,
            lon,
        }),
};

export default API;
