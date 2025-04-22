import { useUserStore } from "@/store/user/user-store"
import { useState, useEffect } from "react"
import { TPost } from "@/types/post"
import Link from "next/link";
import { CodeMarkdownArea } from "@/components/post/details";
import { userService } from "@/service/user";
import { useTranslation } from "react-i18next";
import { postService } from "@/service/post";

const MyLikedPosts = () => {
    const { user } = useUserStore()
    const [posts, setPosts] = useState<TPost[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation('archive')
    const [isLoggedIn, setIsLoggedIn] = useState(true)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await userService.getUserLikedPosts();
                if (res.status === 202) {
                    setPosts([]);
                } else {
                    setPosts(res.data as TPost[]);
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
            <h1 className="text-3xl font-bold mb-6">{t('my_liked_posts.title')}</h1>
            {!isLoggedIn && (
                <span className="text-lg font-normal">{t('my_liked_posts.log_in')}</span>
            )}
            {loading && (
                <div className="flex items-center justify-center w-full h-full min-h-screen">
                    <div className="flex items-center justify-center my-3">
                        <div className="w-5 h-5 border-2 border-t-transparent border-black rounded-full animate-spin"></div>
                    </div>
                </div>
            )}
            {posts === null ? (
                <p>{t('my_liked_posts.empty')}</p>
            ) : (
                <div className="flex flex-col items-center gap-4 w-full">
                    {posts.map(post => (
                        <div key={post.id} className="border border-black border-b-4 rounded-2xl p-4 shadow-sm w-full">
                            <div className="flex flex-col gap-2 whitespace-pre-wrap break-words break-all">
                                <div className="flex flex-row items-center justify-between w-full">
                                    <div className="hover:underline hover:cursor-pointer flex-grow" onClick={() => handleClickItem(post)}>
                                        <h2 className="text-xl font-semibold text-left whitespace-pre-wrap break-words break-all">{post.title}</h2>
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm">
                                    {t('my_liked_posts.item.author')} {post.author}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    {t('my_liked_posts.item.last_modified')} {new Date(post.last_modified).toLocaleString()}
                                </p>
                                <p className="text-gray-600">{post.description}</p>
                                <div className="flex flex-col items-start gap-2 w-full my-2 p-4 border rounded-lg">
                                    <div className="grid grid-cols-[8rem_1fr] items-center gap-2 w-full">
                                        <span className="text-sm font-semibold">{t('my_liked_posts.item.support_files')}</span>
                                        <span className="bg-gray-100 py-2 px-3 rounded-lg">{post.testcase.input}</span>
                                    </div>
                                    <div className="grid grid-cols-[8rem_1fr] items-center gap-2 w-full">
                                        <span className="text-sm font-semibold">{t('my_liked_posts.item.expected')}</span>
                                        <span className="bg-gray-100 py-2 px-3 rounded-lg">{post.testcase.expected}</span>
                                    </div>
                                </div>
                                <span className="font-semibold text-sm">T{t('my_liked_posts.item.code')}</span>
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