export type Config = {
    BACKEND_URL: string;
}

export const config: Config = {
    BACKEND_URL: import.meta.env.VITE_BACKEND_URL 
};