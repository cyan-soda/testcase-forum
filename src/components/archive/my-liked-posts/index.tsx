import { useUserStore } from "@/store/user/user-store"
import { useState, useEffect } from "react"
import { TPost } from "@/types/post"
import Link from "next/link";
import { CodeMarkdownArea } from "@/components/post/details";
import { userService } from "@/service/user";

const MyLikedPosts = () => {
    const { user } = useUserStore()
    const [posts, setPosts] = useState<TPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await userService.getUserLikedPosts();
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

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full min-h-screen">
                <h1 className="text-2xl font-bold">Please login to see your posts</h1>
            </div>
        );
    }

    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold mb-6">My Liked Posts</h1>
            {posts.length === 0 ? (
                <p>No posts found.</p>
            ) : (
                <div className="flex flex-col items-center gap-4 w-full">
                    {posts.map(post => (
                        <div key={post.id} className="border border-black border-b-4 rounded-2xl p-4 shadow-sm w-full">
                            <div className="space-y-2">
                                <div className="flex flex-row items-center justify-between w-full">
                                    <Link href={`/space/CO1005/242/${post.id}`} className="hover:underline w-full">
                                        <h2 className="text-xl font-semibold text-left w-full">{post.title}</h2>
                                    </Link>
                                </div>
                                <p className="text-gray-500 text-sm">
                                    Author: {post.author}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    Last Modified: {new Date(post.last_modified).toLocaleString()}
                                </p>
                                <p className="text-gray-600">{post.description}</p>
                                <div className="flex flex-col items-start gap-2 w-full my-2 p-4 border rounded-lg">
                                    <div className="grid grid-cols-[8rem_1fr] items-center gap-2 w-full">
                                        <span className="text-sm font-semibold">Input:</span>
                                        <span className="bg-gray-100 py-2 px-3 rounded-lg">{post.testcase.input}</span>
                                    </div>
                                    <div className="grid grid-cols-[8rem_1fr] items-center gap-2 w-full">
                                        <span className="text-sm font-semibold">Expected Output:</span>
                                        <span className="bg-gray-100 py-2 px-3 rounded-lg">{post.testcase.expected}</span>
                                    </div>
                                </div>
                                <CodeMarkdownArea code={post.testcase.code} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyLikedPosts