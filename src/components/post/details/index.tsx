'use client'

import Image from "next/image"
import { useState, useEffect } from "react"

import iconSave from '@/icons/save-2.svg'
import iconHide from '@/icons/eye-slash.svg'
import iconReport from '@/icons/danger.svg'

import PreviewPopup from '@/components/shared/popup-preview'
import { PostCardProps, Tag } from "@/components/home/card"
import { LikeButton, CommentButton, BadgeButton } from "@/components/shared/buttons"
import Comment from "../comments"
import RecPosts from "../rec-posts"

const getInitials = (name: string) => {
    const names = name.split(' ')
    return names.map((n) => n[0]).join('')
}

const Tab = ({ title, isActive, count, onClick }: { title: string, isActive: boolean, count?: number, onClick: () => void }) => {
    return (
        <button
            className={`text-sm font-bold rounded-lg 
                ${isActive ? 'text-white bg-black' : 'text-black bg-grey'} py-2 px-[10px]
                hover:bg-white hover:text-black transition-all duration-200`}
            onClick={onClick}
        >
            {title} {count ? `(${count})` : ''}
        </button>
    )
}
interface Comment {
    id: string;
    parent_id: string | null;
    author: string;
    content: string;
    created_at: string;
    like_count: 5,
    comment_count: 5,
    badge_count: 2,
    date: '3 days ago',
}

// const COMMENTS = [
//     {
//         id: 0,
//         author: 'Naomi',
//         date: '3 days ago',
//         like_count: 5,
//         comment_count: 5,
//         badge_count: 2,
//         content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//         parent_id: null,
//     },
//     {
//         id: 1,
//         author: 'Naomi',
//         date: '2 days ago',
//         like_count: 15,
//         comment_count: 2,
//         badge_count: 0,
//         content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//         parent_id: 0,
//     },
    // {
    //     id: 2,
    //     author: 'Naomi',
    //     date: '1 days ago',
    //     like_count: 15,
    //     comment_count: 2,
    //     badge_count: 0,
    //     content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    //     parent_id: 1,
    // },
    // {
    //     id: 3,
    //     author: 'Naomi',
    //     date: '2 days ago',
    //     like_count: 15,
    //     comment_count: 2,
    //     badge_count: 0,
    //     content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    //     parent_id: 0,
    // },
    // {
    //     id: 4,
    //     author: 'Naomi',
    //     date: '2 days ago',
    //     like_count: 15,
    //     comment_count: 2,
    //     badge_count: 0,
    //     content: 'Comment 2',
    //     parent_id: null,
    // },
    // {
    //     id: 5,
    //     author: 'Naomi',
    //     date: '2 days ago',
    //     like_count: 15,
    //     comment_count: 2,
    //     badge_count: 0,
    //     content: 'Comment 3',
    //     parent_id: null,
    // }
// ]

const POSTS = [
    { title: "I put my minimum effort into creating this set of test cases for you guys, but I promise it works for 90% of this assignment.", author: "Dang Hoang", link: "#" },
    { title: "I put my minimum effort into creating this set of test cases for you guys, but I promise it works for 90% of this assignment.", author: "Son Nguyen", link: "#" },
    { title: "I put my minimum effort into creating this set of test cases for you guys, but I promise it works for 90% of this assignment.", author: "Dang Hoang", link: "#" },
    { title: "I put my minimum effort into creating this set of test cases for you guys, but I promise it works for 90% of this assignment.", author: "Son Nguyen", link: "#" },
    { title: "I put my minimum effort into creating this set of test cases for you guys, but I promise it works for 90% of this assignment.", author: "Dang Hoang", link: "#" },
]

export type CommentProps = {
    id: number,
    author: string,
    date: string,
    like_count: number,
    comment_count: number,
    badge_count: number,
    content: string,
    parent_id: number | null,
}

const PostDetails = ({ post }: { post: PostCardProps }) => {
    post.date = new Date(post.date).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
    const [comments, setComments] = useState<CommentProps[]>([]);
    const [loading, setLoading] = useState(true);

    const [isOpenComment, setIsOpenComment] = useState(false)
    const [isOpenBadge, setIsOpenBadge] = useState(false)

    const [isOpenPreviewPopup, setIsOpenPreviewPopup] = useState(false)
    const handleOpenPreviewPopup = () => {
        setIsOpenPreviewPopup(true)
    }

    const [activeTab, setActiveTab] = useState<'comments' | 'similar'>('comments')
    const handleToggleTab = (tab: 'comments' | 'similar') => {
        setActiveTab(tab)
    }

    const fetchComments = async () => {
        try {
            const res = await fetch(`http://localhost:3000/post/${post.id}/comments`);
            if (!res.ok) throw new Error("Lỗi khi tải comment");

            const data = await res.json();
            setComments(data);
        } catch (error) {
            console.error("Lỗi khi tải comment:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [post.id]);

    return (
        <>
            <div className="min-h-screen bg-white text-black p-5 rounded-xl flex flex-col gap-5 items-center">
                <div className="flex flex-col gap-5 pb-5 items-center w-full border-b border-black">
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
                                <button><Image src={iconSave} alt="" width={24} height={24} /></button>
                                <button><Image src={iconHide} alt="" width={24} height={24} /></button>
                                <button><Image src={iconReport} alt="" width={24} height={24} /></button>
                            </div>
                        </div>
                        <div className="w-full flex flex-row items-start gap-2">
                            <div className="flex flex-row items-center gap-[2px]">
                                <span className="text-xs font-semibold">Posted</span>
                                <span className="text-xs font-normal">{post.date}</span>
                            </div>
                            <div className="flex flex-row items-center gap-[2px]">
                                <span className="text-xs font-semibold">Modified</span>
                                <span className="text-xs font-normal">{post.date}</span>
                            </div>
                        </div>
                        <span className="text-xl font-semibold">{post.title}</span>
                        <div className='flex flex-row gap-[10px] mt-[2px]'>
                            {post.tags.map((tag, index) => (
                                <Tag key={index} tag={tag} />
                            ))}
                        </div>
                    </div>
                    <div className="text-sm font-light">
                        {post.description}
                    </div>
                    <div className="flex flex-row items-center justify-between w-full">
                        <div className="flex flex-row items-center gap-3">
                            <LikeButton like_count={0} />
                            {/* <CommentButton count={5} isOpenComment={isOpenComment} setIsOpenComment={() => { setIsOpenComment(!isOpenComment) }} /> */}
                            <BadgeButton count={2} isOpenBadge={isOpenBadge} setIsOpenBadge={() => { setIsOpenBadge(!isOpenBadge) }} />
                        </div>
                        <button
                            className={`bg-grey rounded-lg py-2 px-3 text-sm font-bold text-black`}
                            onClick={() => { handleOpenPreviewPopup() }}
                        >
                            Preview Testcases
                        </button>
                    </div>
                </div>
                <div className="flex flex-col gap-7 w-full">
                    <div className="flex flex-row items-start gap-3 w-full">
                        <Tab
                            title="Comments"
                            isActive={activeTab === 'comments'}
                            onClick={() => handleToggleTab('comments')}
                            count={comments.length}
                        />
                        <Tab
                            title="Related Posts"
                            isActive={activeTab === 'similar'}
                            onClick={() => handleToggleTab('similar')}
                            count={POSTS.length}
                        />
                    </div>
                    <div className="w-full">
                        {activeTab === 'comments' && (
                            <div className="flex flex-col gap-10 w-full">
                                {comments.map((comment) => (
                                        <Comment key={comment.id} comment={comment} />
                                ))}
                            </div>
                        )}
                        {activeTab === 'similar' && (
                            <div className="flex flex-col gap-5 w-full">
                                {POSTS.map((post, index) => (
                                    <RecPosts key={index} title={post.title} author={post.author} link={post.link} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <PreviewPopup isOpen={isOpenPreviewPopup} onClose={() => setIsOpenPreviewPopup(false)} testcase={post.testcase}/>
        </>
    )
}

export default PostDetails