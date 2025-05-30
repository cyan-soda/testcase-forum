'use-client'

import axiosClient from "../axios-client"
export class PostService {
    async getAllPosts() {
        const response = await axiosClient.get(`/posts`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    }

    async getPost(id: string) {
        const response = await axiosClient.get(`/post/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    }

    async getAllPostIDs() {
        const response = await axiosClient.get(`/postsID`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    }

    async updatePost(id: string, title: string, description: string, expected: string, code: string, input?: File) {
        const formData = new FormData()
        formData.append("title", title)
        formData.append("description", description)
        if (input) {
            formData.append("input", input);
        }
        formData.append("expected", expected)
        formData.append("code", code)

        const response = await axiosClient.put(`/post/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        return response.data
    }

    async deletePost(id: string) {
        const response = await axiosClient.delete(`/delete/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    }

    async likePost(id: string) {
        const response = await axiosClient.put(`/post/${id}/like`, {}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    }

    async createPostForm(title: string, description: string, expected: string, code: string, input?: File) {
        const formData = new FormData()
        formData.append("title", title)
        formData.append("description", description)
        if (input) {
            formData.append("input", input);
        }
        formData.append("expected", expected)
        formData.append("code", code)

        const response = await axiosClient.post(`/create`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        return response;
    }

    async clickPost(post_id: string, post_type: number) {
        const response = await axiosClient.post(`/posts/read`, {post_id, post_type}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    }

    async getSuggestedPosts() {
        const response = await axiosClient.get(`/sgposts`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    }

    async getRecommendedPosts() {
        const response = await axiosClient.get(`/recposts`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    }

    async getRelatedPosts(post_id: string) {
        const response = await axiosClient.get(`/post/${post_id}/related`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data.related_posts;
    }

    async createPostAnyway(post_id: string) {
        const response = await axiosClient.post(`/confirm/${post_id}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    }

    async getPopularPosts() {
        const response = await axiosClient.get(`/posts/hot`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    }
}

export const postService = new PostService();