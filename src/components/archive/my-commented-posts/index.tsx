import { useUserStore } from "@/store/user/user-store"
import { useState, useEffect } from "react"
import { TPost } from "@/types/post"
import Link from "next/link";
import { userService } from "@/service/user";
import { TComment } from "@/types/comment";
import { useTranslation } from "react-i18next";
import { postService } from "@/service/post";

interface IMyCommentedPostsProps {
    post: TPost
    comments: TComment[]
}

const MyCommentedPosts = () => {
    const { user } = useUserStore()
    const [posts, setPosts] = useState<IMyCommentedPostsProps[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation('archive')
    const [isLoggedIn, setIsLoggedIn] = useState(true)

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
                    // console.log(Object.values(groupedPosts));
                }
                setLoading(false);
            } catch (error) {
                if ((error as { status?: number }).status === 401) {
                    setIsLoggedIn(false)
                    setLoading(false)
                    return
                }
                console.error("Error fetching posts:", error);
                setLoading(false);
            }
        };

        if (user) {
            fetchPosts();
        }
    }, [user]);

    const handleClickItem = async (post: TPost) => {
        try {
            await postService.clickPost(post.id, post.post_type)
        } catch (error) {
            alert("Can't open post.")
        }
        window.open(`/space/CO1005/242/${post.id}`, '_blank', 'noopener,noreferrer')
    }

    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold mb-6">{t('my_commented_posts.title')}</h1>
            {!isLoggedIn && (
                <span className="text-lg font-normal">{t('my_commented_posts.log_in')}</span>
            )}
            {loading && (
                <div className="flex items-center justify-center w-full h-full min-h-screen">
                    <div className="flex items-center justify-center my-3">
                        <div className="w-5 h-5 border-2 border-t-transparent border-black rounded-full animate-spin"></div>
                    </div>
                </div>
            )}
            {posts === null ? (
                <p>{t('my_commented_posts.empty')}</p>
            ) : (
                <div className="flex flex-col items-center gap-4 w-full">
                    {posts.map((item, index) => (
                        <div key={index} className="border border-black border-b-4 rounded-2xl p-4 shadow-sm w-full">
                            <div className="space-y-2 whitespace-pre-wrap break-words break-all">
                                <div className="flex flex-row items-center justify-between w-full">
                                    <div className="hover:underline hover:cursor-pointer flex-grow" onClick={() => handleClickItem(item.post)}>
                                        <h2 className="text-xl font-semibold text-left whitespace-pre-wrap break-words break-all">{item.post.title}</h2>
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm">
                                    {t('my_commented_posts.item.author')} {item.post.author}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    {t('my_commented_posts.item.last_modified')} {new Date(item.post.last_modified).toLocaleString()}
                                </p>
                                <p className="text-gray-600">{item.post.description}</p>
                                <div className="flex flex-col items-start gap-2 w-full my-2 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                    <h3 className="text-lg font-semibold text-gray-800">{t('my_commented_posts.item.your_comments')}</h3>
                                    {item.comments?.map((comment, commentIndex) => (
                                        <div key={commentIndex} className="w-full border-t border-gray-200 pt-2 mt-2 first:border-t-0 first:pt-0 first:mt-0">
                                            <p className="text-gray-600">{comment.content}</p>
                                            <p className="text-gray-500 text-sm">
                                                {t('my_commented_posts.item.commented_on')} {new Date(comment.created_at).toLocaleString()}
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