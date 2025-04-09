import axiosClient from "../axios-client"

export const commentService = {
    getAllComments: async (post_id: string) => {
        const response = await axiosClient.get(`http://localhost:3000/post/${post_id}/comments`)
        return response.data
    },
    createComment: async (
        user_mail: string,
        post_id: string,
        content: string,
    ) => {
        const response = await axiosClient.post(`http://localhost:3000/comment`, {
            user_mail,
            post_id,
            content,
        })
        return response.data
    },
    deleteComment: async (comment_id: string) => {
        const response = await axiosClient.delete(`http://localhost:3000/comment/${comment_id}`)
        return response.data
    },
    updateComment: async (
        comment_id: string,
        user_mail: string,
        content: string,
    ) => {
        const response = await axiosClient.put(`http://localhost:3000/comment/${comment_id}`, {
            user_mail,
            content,
        })
        return response.data
    },
}