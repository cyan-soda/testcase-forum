'use client'

// import Image from "next/image"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
// import iconSave from '@/icons/save-2.svg'
// import iconHide from '@/icons/eye-slash.svg'
// import iconReport from '@/icons/danger.svg'

const PreviewPopup = dynamic(() => import('@/components/shared/popup-preview'), { ssr: false })
// import { Tag } from "@/components/home/card"
import { LikeButton, BadgeButton } from "@/components/shared/buttons"
import Comment from "../comments"
import RecPosts from "../rec-posts"
import { commentService } from "@/service/comment"
import { TPost, TPostRelated } from "@/types/post"
import CommentEditor from "../comment-editor"
import { TComment } from "@/types/comment"
// import { usePostStore } from "@/store/post/post-store"
import { postService } from "@/service/post"
import { useTranslation } from "react-i18next"

const getInitials = (name: string) => {
    if (!name) return ''
    if (name.length === 0) return ''
    const names = name.split(' ')
    if (names.length === 1) return names[0][0]
    return `${names[names.length - 1][0]}${names[0][0]}`
}

const Tab = ({ title, isActive, count, onClick }: { title: string, isActive: boolean, count?: number, onClick: () => void }) => {
    return (
        <button
            className={`text-sm font-bold rounded-lg 
                ${isActive ? 'text-white bg-black' : 'text-black bg-grey'} py-2 px-[10px]`}
            onClick={onClick}
        >
            {title} {count ? `(${count})` : ''}
        </button>
    )
}

export const CodeMarkdownArea = ({ code }: { code: string }) => {
    const {t} = useTranslation('post')
    const lines = (code || t('post_details.no_code_markdown')).split('\n')
    return (
        <div className="rounded-lg bg-grey px-3 py-3 text-sm font-mono w-full">
            <pre className="whitespace-pre-wrap break-words">
                {lines.map((line, index) => (
                    <div key={index} className="flex whitespace-pre-wrap break-words">
                        <span className="text-gray-400 w-8 text-right pr-3 select-none">
                            {index + 1}
                        </span>
                        <span className="flex-1 whitespace-pre-wrap break-words break-all">
                            {line || '\u00A0'}
                        </span>
                    </div>
                ))}
            </pre>
        </div>
    )
}

const PostDetails = ({ post }: { post: TPost }) => {
    const {t} = useTranslation('post')

    if (post) {
        post.last_modified = new Date(post.last_modified).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
        post.created_at = new Date(post.created_at).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    }

    const [comments, setComments] = useState<TComment[]>([]);
    const [loadingComment, setLoadingComment] = useState(true);

    const [relatedPosts, setRelatedPosts] = useState<TPostRelated[]>([]);
    const [loadingRelatedPosts, setLoadingRelatedPosts] = useState(true);
    const [errorRelatedPosts, setErrorRelatedPosts] = useState<string | null>(null);

    // const [isOpenComment, setIsOpenComment] = useState(false);
    const [isOpenBadge, setIsOpenBadge] = useState(false);
    const [isOpenPreviewPopup, setIsOpenPreviewPopup] = useState(false);

    const [activeTab, setActiveTab] = useState<'comments' | 'similar'>('comments');
    const handleToggleTab = (tab: 'comments' | 'similar') => {
        setActiveTab(tab);
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setLoadingComment(true);
                const res = await commentService.getAllComments(post.id);
                setComments(res);
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                setLoadingComment(false);
            }
        };

        const fetchRelatedPosts = async () => {
            try {
                setLoadingRelatedPosts(true);
                setErrorRelatedPosts(null); // Reset error state
                const res = await postService.getRelatedPosts(post.id);
                if (res.status === 202) {
                    setRelatedPosts([]); // No related posts found
                } else {
                    setRelatedPosts(res); // Set related posts
                }
            } catch (error) {
                console.error("Error fetching related posts:", error);
                setErrorRelatedPosts(t('post_details.error_loading_post'));
                setRelatedPosts([]); // Clear posts on error
            } finally {
                setLoadingRelatedPosts(false);
            }
        };

        fetchComments();
        fetchRelatedPosts();
    }, [post.id]);

    return (
        <>
            <div className="min-h-screen bg-white text-black p-5 rounded-xl flex flex-col gap-5 items-center">               
                <div className="flex flex-col gap-2 pb-5 w-full border-b border-black">
                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex flex-row items-center justify-between w-full">
                            {/* user's name, avatar & active status */}
                            <div className='flex flex-row gap-[10px] items-center justify-start'>
                                <div className='rounded-full bg-grey h-10 w-10 text-black flex items-center justify-center'>{getInitials(post.author)}</div>
                                <div className='flex flex-col items-start'>
                                    <div className='flex flex-row items-center gap-2'>
                                        <span className='text-base font-semibold flex-1'>{post.author}</span>
                                        <div className='bg-green rounded-full h-[6px] w-[6px]'></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row items-center gap-4">
                                {/* <button><Image src={iconSave} alt="" width={24} height={24} /></button>
                                <button><Image src={iconHide} alt="" width={24} height={24} /></button>
                                <button><Image src={iconReport} alt="" width={24} height={24} /></button> */}
                            </div>
                        </div>
                        <div className="w-full flex flex-row items-start gap-2">
                            <div className="flex flex-row items-center gap-[2px]">
                                <span className="text-xs font-semibold">{t('post_details.posted')}</span>
                                <span className="text-xs font-normal">{post?.created_at}</span>
                            </div>
                            <div className="flex flex-row items-center gap-[2px]">
                                <span className="text-xs font-semibold">{t('post_details.modified')}</span>
                                <span className="text-xs font-normal">{post?.last_modified}</span>
                            </div>
                        </div>
                        <span className="text-xl font-semibold mt-2 whitespace-pre-wrap break-words">{post.title}</span>
                        {/* <div className='flex flex-row gap-[10px] mt-[2px]'>
                            {post.tags?.map((tag, index) => (
                                <Tag key={index} tag={tag} />
                            ))}
                        </div> */}
                    </div>

                    <div className="text-sm font-light text-left w-full mt-4 mb-2 whitespace-pre-wrap break-words">
                        {post.description}
                    </div>
                    <div className="flex flex-col items-start gap-2 w-full my-2 p-4 border rounded-lg">
                        <div className="grid grid-cols-[8rem_1fr] items-center gap-2 w-full">
                            <span className="text-sm font-semibold">{t('post_details.support_file')}</span>
                            <div className="bg-grey py-2 px-3 rounded-lg whitespace-pre-wrap break-words break-all">{post.testcase.input}</div>
                        </div>
                        <div className="grid grid-cols-[8rem_1fr] items-center gap-2 w-full">
                            <span className="text-sm font-semibold">{t('post_details.expected_output')}</span>
                            <div className="bg-grey py-2 px-3 rounded-lg whitespace-pre-wrap break-words break-all">{post.testcase.expected}</div>
                        </div>
                    </div>
                    <span className="text-sm font-semibold text-left">{t('post_details.test_code')}</span>
                    <CodeMarkdownArea code={post.testcase.code} />
                    <div className="flex flex-row items-center justify-between w-full mt-2">
                        <div className="flex flex-row items-center gap-3">
                            <LikeButton post={post} />
                            {/* <CommentButton count={5} isOpenComment={isOpenComment} setIsOpenComment={() => { setIsOpenComment(!isOpenComment) }} /> */}
                            {/* <BadgeButton count={post.interaction?.verified_teacher_mail ? 1 : 0} setIsOpenBadge={() => { setIsOpenBadge(!isOpenBadge) }} /> */}
                        </div>
                        {/* <button
                            className={`bg-grey rounded-lg py-2 px-3 text-sm font-bold text-black`}
                            onClick={() => { handleOpenPreviewPopup() }}
                        >
                            Preview Testcases
                        </button> */}
                    </div>
                </div>
                <div className="flex flex-col gap-5 w-full">
                    <div className="flex flex-row items-start gap-3 w-full">
                        <Tab
                            title={t('post_details.comments')}
                            isActive={activeTab === 'comments'}
                            onClick={() => handleToggleTab('comments')}
                            count={comments.length}
                        />
                        <Tab
                            title={t('post_details.related_posts')}
                            isActive={activeTab === 'similar'}
                            onClick={() => handleToggleTab('similar')}
                            count={relatedPosts.length}
                        />
                    </div>
                    <div className="w-full">
                        {activeTab === 'comments' && (
                            <div className="flex flex-col gap-5 w-full">
                                {/* comment editor */}
                                <CommentEditor
                                    postId={post.id}
                                    placeholder={t('post_details.comment_placeholder')}
                                    onCommentCreated={() => {
                                        setLoadingComment(true)
                                        commentService.getAllComments(post.id).then(res => {
                                            setComments(res)
                                            setLoadingComment(false)
                                        })
                                    }}
                                />
                                {loadingComment && (<div className="text-center">{t('post_details.loading_comments')}</div>)}
                                {comments.length === 0 && (<div className="text-center">{t('post_details.no_comments')}</div>)}
                                {comments
                                    .sort((a: TComment, b: TComment) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                    .map((comment: TComment) => (
                                        <Comment
                                            key={comment.id}
                                            comment={comment}
                                        />
                                    ))
                                } 
                            </div>
                        )}
                        {activeTab === 'similar' && (
                            <div className="flex flex-col gap-5 w-full">
                                {loadingRelatedPosts ? (
                                    <div className="text-center">{t('post_details.loading_related_posts')}</div>
                                ) : errorRelatedPosts ? (
                                    <div className="text-center text-red-500">{errorRelatedPosts}</div>
                                ) : relatedPosts.length === 0 ? (
                                    <div className="text-center">{t('post_details.no_related_posts')}</div>
                                ) : (
                                    relatedPosts.map((post, index) => (
                                        <RecPosts
                                            key={index}
                                            title={post.title}
                                            author={post.author}
                                            id={post.post_id}
                                        />
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <PreviewPopup isOpen={isOpenPreviewPopup} onClose={() => setIsOpenPreviewPopup(false)} testcase={post.testcase} />
        </>
    )
}

export default PostDetails