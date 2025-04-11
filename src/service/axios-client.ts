import axios, { AxiosResponse } from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/'

const axiosClient = axios.create({
    baseURL: baseURL,
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
})

export default axiosClient

export const setAuthorizationHeader = (token: string) => {
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
}