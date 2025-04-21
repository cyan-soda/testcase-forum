import { useUserStore } from "@/store/user/user-store"
import { useState, useEffect } from "react"
import { TPost } from "@/types/post"
import Link from "next/link";
import { userService } from "@/service/user";
import { TComment } from "@/types/comment";

interface IMyCommentedPostsProps {
    post: TPost
    comments: TComment[]
}

const MyCommentedPosts = () => {
    const { user } = useUserStore()
    const [posts, setPosts] = useState<IMyCommentedPostsProps[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await userService.getUserCommentedPosts();
                if (res.status === 202) {
                    setPosts([]);
                } else {
                    // Group comments by post_id
                    const rawData = res.data as { comment: TComment, post: TPost }[];
                    const groupedPosts: { [key: string]: IMyCommentedPostsProps } = {};

                    rawData.forEach(({ comment, post }) => {
                        if (!groupedPosts[comment.post_id]) {
                            groupedPosts[comment.post_id] = {
                                post,
                                comments: []
                            };
                        }
                        groupedPosts[comment.post_id].comments.push(comment);
                    });

                    setPosts(Object.values(groupedPosts));
                    console.log(Object.values(groupedPosts));
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

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full min-h-screen">
                <h1 className="text-2xl font-bold">Please login to see your posts</h1>
            </div>
        );
    }

    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold mb-6">My Commented Posts</h1>
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
                    {posts.map((item, index) => (
                        <div key={index} className="border border-black border-b-4 rounded-2xl p-4 shadow-sm w-full">
                            <div className="space-y-2 whitespace-pre-wrap break-words break-all">
                                <div className="flex flex-row items-center justify-between w-full">
                                    <Link href={`/space/CO1005/242/${item.post.id}`} className="hover:underline w-full" target="_blank" rel="noopener noreferrer">
                                        <h2 className="text-xl font-semibold text-left w-full">{item.post.title}</h2>
                                    </Link>
                                </div>
                                <p className="text-gray-500 text-sm">
                                    Author: {item.post.author}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    Last Modified: {new Date(item.post.last_modified).toLocaleString()}
                                </p>
                                <p className="text-gray-600">{item.post.description}</p>
                                <div className="flex flex-col items-start gap-2 w-full my-2 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                    <h3 className="text-lg font-semibold text-gray-800">Your Comments</h3>
                                    {item.comments?.map((comment, commentIndex) => (
                                        <div key={commentIndex} className="w-full border-t border-gray-200 pt-2 mt-2 first:border-t-0 first:pt-0 first:mt-0">
                                            <p className="text-gray-600">{comment.content}</p>
                                            <p className="text-gray-500 text-sm">
                                                Commented on: {new Date(comment.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyCommentedPosts