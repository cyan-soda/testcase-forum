'use-client'

import axiosClient from "../axios-client"
import axios from "axios"

export class PostService {
    async getAllPosts() {
        const response = await axiosClient.get(`/api/private/posts`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    }

    async getPost(id: string) {
        const response = await axiosClient.get(`/api/private/post/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    }

    async getAllPostIDs() {
        const response = await axiosClient.get(`/api/private/postsID`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    }

    async updatePost(
        id: string,
        user_mail: string,
        title: string,
        description: string,
        testcase: { input: string; expected_output: string }
    ) {
        const response = await axiosClient.put(`/api/private/update/${id}`, {
            user_mail,
            title,
            description,
            testcase,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    }

    async deletePost(id: string) {
        const response = await axiosClient.delete(`/api/private/delete/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    }

    async likePost(id: string) {
        const response = await axiosClient.put(`/api/private/post/${id}/like`, {}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    }

    async createPostForm(title: string, description: string, input: string, expected: string, code: string) {
        const formData = new FormData()
        formData.append("title", title)
        formData.append("description", description)
        formData.append("input", input)
        formData.append("expected", expected)
        formData.append("code", code)

        const response = await axiosClient.post(`/api/private/create`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        return response.data;
    }

    async clickPost(post_id: string, post_type: number) {
        const response = await axiosClient.post(`/api/private/posts/read`, {post_id, post_type}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    }

    async getSuggestedPosts() {
        const response = await axiosClient.get(`/api/private/sgposts`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    }

    async getRelatedPosts(post_id: string) {
        const response = await axiosClient.get(`/api/private/post/${post_id}/related`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data.related_posts;
    }

    async createPostAnyway(post_id: string) {
        const response = await axiosClient.post(`/api/private/confirm/${post_id}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    }
}

export const postService = new PostService();