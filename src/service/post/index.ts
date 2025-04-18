'use-client'

import axiosClient from "../axios-client"
import axios from "axios"

export class PostService {
    private baseUrl = 'http://localhost:3000';

    async getAllPosts() {
        const response = await axiosClient.get(`${this.baseUrl}/posts`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    }

    async getPost(id: string) {
        const response = await axiosClient.get(`${this.baseUrl}/post/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    }

    async getAllPostIDs() {
        const response = await axiosClient.get(`${this.baseUrl}/postsID`, {
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
        const response = await axiosClient.put(`${this.baseUrl}/update/${id}`, {
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
        const response = await axiosClient.delete(`${this.baseUrl}/delete/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    }

    async likePost(id: string) {
        const response = await axiosClient.put(`${this.baseUrl}/post/${id}/like`, {}, {
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

        const response = await axiosClient.post(`${this.baseUrl}/create`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        return response.data;
    }

    async clickPost(post_id: string, post_type: number) {
        const response = await axiosClient.post(`${this.baseUrl}/posts/read`, {post_id, post_type}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    }

    async getSuggestedPosts() {
        const response = await axiosClient.get(`${this.baseUrl}/sgposts`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    }
}

export const postService = new PostService();