'use-client'

import axiosClient from "../axios-client"

export class UserService {
    private baseUrl = 'http://localhost:3000';

    getUserPosts = async () => {
        const response = await axiosClient.get(`${this.baseUrl}/user/posts`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    }

    getUserLikedPosts = async () => {
        const response = await axiosClient.get(`${this.baseUrl}/user/likedposts`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    }

    getUserCommentedPosts = async () => {
        const response = await axiosClient.get(`${this.baseUrl}/user/commentedposts`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    }
}