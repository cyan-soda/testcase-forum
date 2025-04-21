'use client'

import { useState, useEffect } from "react";
import { useUserStore } from "@/store/user/user-store";
import { TPost } from "@/types/post";
import { userService } from "@/service/user";
import { postService } from "@/service/post";
import { CodeMarkdownArea } from "@/components/post/details";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as Yup from "yup";
import Link from "next/link";

// Validation schema using Yup
// const postSchema = Yup.object().shape({
//     title: Yup.string().required("Title is required").min(1, "Title cannot be empty"),
//     description: Yup.string().required("Description is required").min(1, "Description cannot be empty"),
//     input: Yup.string().required("Input is required").min(1, "Input cannot be empty"),
//     expected: Yup.string().required("Expected output is required").min(1, "Expected output cannot be empty"),
//     code: Yup.string().required("Code is required").min(1, "Code cannot be empty"),
// });

const MyPosts = () => {
    const { user } = useUserStore();
    const [posts, setPosts] = useState<TPost[]>([]);
    const [loading, setLoading] = useState(true);
    // const [editingPost, setEditingPost] = useState<TPost | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await userService.getUserPosts();
                if (res.status === 202) {
                    setPosts([]);
                } else {
                    setPosts(res.data as TPost[]);
                }
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
                await postService.deletePost(postId);
                setPosts(posts.filter(post => post.id !== postId));
            } catch (error) {
                console.error("Error deleting post:", error);
            }
        }
    };

    // Handle edit post
    // const handleEdit = (post: TPost) => {
    //     setEditingPost(post);
    // };

    // Handle cancel edit
    // const handleCancelEdit = () => {
    //     setEditingPost(null);
    // };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full min-h-screen">
                <h1 className="text-2xl font-bold">Please login to see your posts</h1>
            </div>
        );
    }

    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold mb-6">My Posts</h1>
            {loading && (
                <div className="flex items-center justify-center w-full h-full min-h-screen">
                    <svg className="animate-spin h-10 w-10 text-gray-900" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" stroke="currentColor" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4.93 4.93a10 10 0 0 1 14.14 14.14L12 12l-7.07-7.07z"></path>
                    </svg>
                </div>
            )}
            {posts === null ? (
                <p>No posts found.</p>
            ) : (
                <div className="flex flex-col items-center gap-4 w-full">
                    {posts.map(post => (
                        <div key={post.id} className="border border-black border-b-4 rounded-2xl p-4 shadow-sm w-full">
                            {/* {editingPost?.id === post.id ? (
                                <EditPostForm
                                    post={editingPost}
                                    onSave={(postId, updatedData) => {
                                        setPosts(posts.map(post => (post.id === postId ? { ...post, ...updatedData } : post)));
                                        setEditingPost(null);
                                    }}
                                    onCancel={handleCancelEdit}
                                />
                            ) : ( */}
                                <div className="flex flex-col items-start gap-2 w-full">
                                    <div className="flex flex-row items-center justify-between w-full">
                                        <Link href={`/space/CO1005/242/${post.id}`} className="hover:underline flex-grow" target="_blank" rel="noopener noreferrer">
                                            <h2 className="text-xl font-semibold text-left whitespace-pre-wrap break-words break-all">{post.title}</h2>
                                        </Link>
                                        <div className="flex items-end text-sm font-medium ml-10">
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="bg-black text-white px-3 py-2 rounded-md"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 text-sm">
                                        Last Modified: {new Date(post.last_modified).toLocaleString()}
                                    </p>
                                    <p className="text-gray-600 whitespace-pre-wrap break-words break-all">{post.description}</p>
                                    <div className="flex flex-col items-start gap-2 w-full my-2 p-4 border rounded-lg">
                                        <div className="grid grid-cols-[8rem_1fr] items-center gap-2 w-full">
                                            <span className="text-sm font-semibold">Support File's Content:</span>
                                            <span className="bg-grey py-2 px-3 rounded-lg whitespace-pre-wrap break-words break-all">{post.testcase.input}</span>
                                        </div>
                                        <div className="grid grid-cols-[8rem_1fr] items-center gap-2 w-full">
                                            <span className="text-sm font-semibold">Expected Output:</span>
                                            <span className="bg-grey py-2 px-3 rounded-lg whitespace-pre-wrap break-words break-all">{post.testcase.expected}</span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-semibold">Test Code:</span>
                                    <CodeMarkdownArea code={post.testcase.code} />
                                </div>
                            {/* )} */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Component for editing a post
// const EditPostForm = ({ post, onSave, onCancel }: { post: TPost, onSave: (postId: string, updatedData: any) => void, onCancel: () => void }) => {
//     const { register, handleSubmit, formState: { errors } } = useForm({
//         resolver: yupResolver(postSchema),
//         defaultValues: {
//             title: post.title,
//             description: post.description,
//             input: post.testcase.input,
//             expected: post.testcase.expected,
//             code: post.testcase.code,
//         },
//     });

//     const onSubmit = async (data: any) => {
//         try {
//             try {
//                 const res = await postService.updatePost(
//                     post.id,
//                     data.title,
//                     data.description,
//                     data.input,
//                     data.expected,
//                     data.code
//                 )
//             } catch (error) {
//                 console.error("Error updating post:", error);
//                 return;
//             }

//             // Update local state
//             onSave(post.id, {
//                 title: data.title,
//                 description: data.description,
//                 testcase: {
//                     ...post.testcase,
//                     input: data.input,
//                     expected: data.expected,
//                     code: data.code,
//                 },
//             });
//         } catch (error) {
//             console.error("Error updating post:", error);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <div>
//                 <label className="block text-sm font-medium">Title</label>
//                 <input
//                     {...register("title")}
//                     className="w-full border border-black rounded-lg p-2"
//                 />
//                 {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
//             </div>
//             <div>
//                 <label className="block text-sm font-medium">Description</label>
//                 <textarea
//                     {...register("description")}
//                     className="w-full border border-black rounded-lg p-2"
//                     rows={4}
//                 />
//                 {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
//             </div>
//             <div>
//                 <label className="block text-sm font-medium">Input</label>
//                 <textarea
//                     {...register("input")}
//                     className="w-full border border-black rounded-lg p-2"
//                     rows={1}
//                 />
//                 {errors.input && <p className="text-red-500 text-sm">{errors.input.message}</p>}
//             </div>
//             <div>
//                 <label className="block text-sm font-medium">Expected Output</label>
//                 <textarea
//                     {...register("expected")}
//                     className="w-full border border-black rounded-lg p-2"
//                     rows={1}
//                 />
//                 {errors.expected && <p className="text-red-500 text-sm">{errors.expected.message}</p>}
//             </div>
//             <div>
//                 <label className="block text-sm font-medium">Code</label>
//                 <textarea
//                     {...register("code")}
//                     className="w-full border border-black rounded-lg p-2 font-mono"
//                     rows={5}
//                 />
//                 {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}
//             </div>
//             <div className="flex space-x-2 w-full justify-end text-sm font-medium">
//                 <button
//                     type="submit"
//                     className="bg-green text-black px-3 py-2 rounded-md"
//                 >
//                     Save
//                 </button>
//                 <button
//                     type="button"
//                     onClick={onCancel}
//                     className="bg-black text-white px-3 py-2 rounded-md"
//                 >
//                     Cancel
//                 </button>
//             </div>
//         </form>
//     );
// };

export default MyPosts;