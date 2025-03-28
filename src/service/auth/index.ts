import axiosClient from "../axios-client";

export const authService = {
    loginGoogle: async () => {
        const response = await axiosClient.get('http://localhost:3000/auth/login');
        return response.data;
    }
}