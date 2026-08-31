import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    // withCredentials: true não é mais estritamente necessário para enviar o token (pois estamos usando Header Authorization), 
    // mas não faz mal deixar caso precise para outras coisas
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'x-site-key': process.env.NEXT_PUBLIC_SITE_KEY || ''
    }
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('@ohara:token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});
