'use-client'

import axiosClient from "../axios-client"

export class UserService {
    getUserPosts = async () => {
        const response = await axiosClient.get(`/user/posts`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response;
    }

    getUserLikedPosts = async () => {
        const response = await axiosClient.get(`/user/likedposts`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response;
    }

    getUserCommentedPosts = async () => {
        const response = await axiosClient.get(`/user/commentedposts`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response;
    }
}

export const userService = new UserService()