import axiosClient from "../axios-client"

export const postService = {
    createPost: async (
        user_mail: string,
        title: string,
        description: string,
        testcase: {
            input: string,
            expected_output: string
        }
    ) => {
        const response = await axiosClient.post('http://localhost:3000/create', {
            user_mail,
            title,
            description,
            testcase
        })
        return response.data
    },
    getAllPosts: async () => {
        const response = await axiosClient.get('http://localhost:3000/posts')
        return response.data
    },
    getPost: async (id: string) => {
        const response = await axiosClient.get(`http://localhost:3000/post/${id}`)
        return response.data
    },
    getAllPostIDs: async () => {
        const response = await axiosClient.get('http://localhost:3000/postsID')
        return response.data
    },
    updatePost: async (
        id: string,
        user_mail: string,
        title: string,
        description: string,
        testcase: {
            input: string,
            expected_output: string
        }
    ) => {
        const response = await axiosClient.put(`http://localhost:3000/update/${id}`, {
            user_mail,
            title,
            description,
            testcase
        })
        return response.data
    },
    deletePost: async (id: string) => {
        const response = await axiosClient.delete(`http://localhost:3000/delete/${id}`)
        return response.data
    },
    likePost: async (id: string) => {
        const response = await axiosClient.post(`http://localhost:3000/${id}/like`)
        return response.data
    },
    createPostForm: async (
        title: string,
        description: string,
        input: string,
        expected: string,
        code: string,
    ) => {
        const response = await axiosClient.post('http://localhost:3000/createform', {
            title,
            description,
            input,
            expected,
            code
        })
        return response.data
    }
}