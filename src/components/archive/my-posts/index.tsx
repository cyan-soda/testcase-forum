'use client'

import { useState, useEffect } from "react";
import { useUserStore } from "@/store/user/user-store";
import { TPost } from "@/types/post";
import { userService } from "@/service/user";
import { postService } from "@/service/post";


const MyPosts = () => {
    const { user } = useUserStore()
    const [posts, setPosts] = useState<TPost[]>([])
    const [loading, setLoading] = useState(true)
    const [editingPost, setEditingPost] = useState<TPost | null>(null)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await userService.getUserPosts()
                setPosts(res as TPost[]);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching posts:", error);
                setLoading(false);
            }
        };

        if (user) {
            fetchPosts();
        }
    }, [user]);

    // Handle delete post
    const handleDelete = async (postId: string) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                const res = await postService.deletePost(postId)
                setPosts(posts.filter(post => post.id !== postId))
            } catch (error) {
                console.error("Error deleting post:", error)
            }
        }
    };

    // Handle edit post
    const handleEdit = (post: TPost) => {
        setEditingPost(post);
    };

    interface UpdatedPostData {
        title: string,
        description: string,
        input: string,
        expected: string,
        code: string,
    }

    const handleSave = async (postId: string, updatedData: UpdatedPostData) => {
        try {
            // Replace with actual API call
            // await api.put(`/posts/${postId}`, updatedData);
            setPosts(posts.map(post => (post.id === postId ? { ...post, ...updatedData } : post)));
            setEditingPost(null);
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        setEditingPost(null);
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full min-h-screen">
                <h1 className="text-2xl font-bold">Please login to see your posts</h1>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold mb-6">My Posts</h1>
            {posts.length === 0 ? (
                <p>No posts found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {posts.map(post => (
                        <div key={post.id} className="border rounded-lg p-4 shadow-sm">
                            {editingPost?.id === post.id ? (
                                <EditPostForm
                                    post={editingPost}
                                    onSave={handleSave}
                                    onCancel={handleCancelEdit}
                                />
                            ) : (
                                <div>
                                    <h2 className="text-xl font-semibold">{post.title}</h2>
                                    <p className="text-gray-600">Subject: {post.subject}</p>
                                    <p className="text-gray-600">Description: {post.description}</p>
                                    <p className="text-gray-500 text-sm">
                                        Last Modified: {new Date(post.last_modified).toLocaleString()}
                                    </p>
                                    <pre className="bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
                                        <code>{post.testcase.code}</code>
                                    </pre>
                                    <div className="mt-4 flex space-x-2 w-full justify-end items-end">
                                        <button
                                            onClick={() => handleEdit(post)}
                                            className="bg-green text-black px-4 py-2 rounded hover:bg-opacity-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="bg-black text-white px-4 py-2 rounded hover:bg-opacity-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Component for editing a post
const EditPostForm = ({ post, onSave, onCancel } : { post: TPost, onSave: (postId: string, updatedData: any) => void, onCancel: () => void }) => {
    const [title, setTitle] = useState(post.title);
    const [description, setDescription] = useState(post.description);
    const [code, setCode] = useState(post.testcase.code);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSave(post.id, {
            title,
            description,
            testcase: { ...post.testcase, code }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border rounded p-2"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border rounded p-2"
                    rows={4}
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium">Code</label>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full border rounded p-2 font-mono"
                    rows={10}
                    required
                />
            </div>
            <div className="flex space-x-2 w-full justify-end">
                <button
                    type="submit"
                    className="bg-green text-black px-4 py-2 rounded"
                >
                    Save
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-black text-white px-4 py-2 rounded"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default MyPosts;