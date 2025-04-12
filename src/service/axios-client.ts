import axios, { AxiosResponse } from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/'

const axiosClient = axios.create({
    baseURL: baseURL,
    // headers: {
    //     Authorization: Bearer ${localStorage.getItem('token')},
    // },
})

axiosClient.interceptors.request.use(
    (config) => {
      // Attach access token into request header before sending
      if (config.headers && localStorage.getItem('token')) {
        const accessToken = localStorage.getItem('token')
        config.headers.Authorization = `Bearer ${accessToken}`
      }
      return config
    },
    (error) => {
      // Do something with request error
      return Promise.reject(error)
    }
  )
export default axiosClient

export const setAuthorizationHeader = (token: string) => {
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
}