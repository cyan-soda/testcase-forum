import axiosClient from "../axios-client";

export const authService = {
    loginGoogle: async (code: string) => {
        console.log('logingg run')
        const response = await axiosClient.post('http://localhost:3000/auth/google', {
            code
        });
        return response.data;
    }
}