'use-client'

import axiosClient from "../axios-client";

export const codeService = {
  submitCodeFile: async (hFile: File, cppFile: File) => {
    const formData = new FormData();
    formData.append('h_file', hFile);
    formData.append('cpp_file', cppFile);

    const response = await axiosClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;

    // try {
    //   const response = await axiosClient.post('/upload', formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //       Authorization: `Bearer ${localStorage.getItem('token')}`,
    //     },
    //   });
    //   return response.data;
    // } catch (error: any) {
    //   throw new Error(error.response?.data?.message || 'Upload failed');
    // }
  },

  runCode: async (post_id: string) => {
    try {
      const response = await axiosClient.get(`/runcode/${post_id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Run code failed');
    }
  },
};