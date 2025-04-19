'use-client'

import axiosClient from "../axios-client"

export const commentService = {
    getAllComments: async (post_id: string) => {
        const response = await axiosClient.get(`/post/${post_id}/comments`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        return response.data
    },
    createComment: async (
        post_id: string,
        content: string,
    ) => {
        const response = await axiosClient.post(`/comment`, {
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
        const response = await axiosClient.delete(`/comment/${comment_id}`, {
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
        const response = await axiosClient.put(`/comment/${comment_id}`, {
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