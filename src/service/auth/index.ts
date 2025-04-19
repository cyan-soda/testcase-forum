import axiosClient from "../axios-client"

export const authService = {

    loginGoogle: async (code: string) => {
        const response = await axiosClient.post(`/auth/google`, {
            code
        })
        return response.data
    }
}