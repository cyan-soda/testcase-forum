'use-client'

import axiosClient from "../axios-client"

export const commentService = {
    getAllComments: async (post_id: string) => {
        const response = await axiosClient.get(`/api/private/post/${post_id}/comments`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    },
    createComment: async (
        // user_mail: string,
        post_id: string,
        content: string,
    ) => {
        const response = await axiosClient.post(`/api/private/comment`, {
            // user_mail,
            post_id,
            content,
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    },
    deleteComment: async (comment_id: string) => {
        const response = await axiosClient.delete(`/api/private/comment/${comment_id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    },
    updateComment: async (
        comment_id: string,
        content: string,
    ) => {
        const response = await axiosClient.put(`/api/private/comment/${comment_id}`, {
            content,
        }, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    },
}