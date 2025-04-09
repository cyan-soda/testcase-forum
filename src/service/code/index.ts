import axiosClient from "../axios-client"

export const codeService = {
    // should send data in form data format of 2 files, with a bearer token
    submitCodeFile: async (
        files: File[],
    ) => {
        const formData = new FormData()
        files.forEach((file) => {
            formData.append('files', file)
        })
        const response = await axiosClient.post('http://localhost:3000/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        return response.data
    },
    runCode: async (post_id: string) => {
        const response = await axiosClient.post(`http://localhost:3000/runcode/${post_id}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        return response.data
    }
}