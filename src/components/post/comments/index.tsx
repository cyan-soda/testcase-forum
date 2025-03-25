'use client'

import Image from 'next/image'
import { useState } from 'react'

import iconSend from '@/icons/send.svg'

import { LikeButton, CommentButton, BadgeButton } from "@/components/shared/buttons"
import { CommentProps } from '../details'

const Comment = ({ comment }: { comment: CommentProps }) => {
    const [isOpenBadge, setIsOpenBadge] = useState(false)
    const [isOpenAnswer, setIsOpenAnswer] = useState(false)
    const [replyContent, setReplyContent] = useState("");
    const [openReplies, setOpenReplies]= useState<Set<number>>(new Set())
    const toggleReply = (parentId: number) => {
        parentId && setOpenReplies((prev) => {
            const newState = new Set(prev)
            if (newState.has(parentId)) {
                newState.delete(parentId)
            } else {
                newState.add(parentId)
            }
            return newState
        })
    }

    const handleReply = async () => {
        if (!replyContent.trim()) return; // Không gửi reply rỗng

        // Lấy user từ localStorage
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            console.error("Not logged in");
            return;
        }

        const user = JSON.parse(storedUser);
        const email = user.mail;

        const replyData = {
            user_mail: email,
            content: replyContent,
            post_id: comment.id,
        };

        try {
            const response = await fetch("http://127.0.0.1:3000/comment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(replyData),
            });

            if (!response.ok) throw new Error();

            setReplyContent("");
            setIsOpenAnswer(false);
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className='w-full flex flex-col gap-5 items-start'>
            <div className='w-full flex flex-col gap-[10px] items-start'>
                <div className='flex flex-row items-center justify-between w-full'>
                    <div className='flex flex-row gap-[10px] items-center justify-start'>
                        <div className='rounded-full bg-grey h-10 w-10 text-black flex items-center justify-center'>{'N'}</div>
                        <div className='flex flex-col items-start'>
                            <div className='flex flex-row items-center gap-2'>
                                <span className='text-base font-semibold flex-1'>{comment.author}</span>
                                <div className='bg-green rounded-full h-[6px] w-[6px]'></div>
                            </div>
                        </div>
                    </div>
                    <span className='text-sm font-normal'><span className='font-semibold'>Posted {' '}</span>{comment.date}</span>
                </div>
                <div className='w-full'>
                    <span className='text-sm font-light text-justify'>
                        {comment.content}
                    </span>
                </div>
                <div className='flex flex-row items-center justify-between w-full'>
                    <div className="flex flex-row items-center gap-3">
                        <LikeButton like_count={comment.like_count} />
                        <CommentButton count={comment.comment_count} onClick={() => comment.parent_id && toggleReply(comment.parent_id)} />
                        <BadgeButton count={comment.badge_count} isOpenBadge={isOpenBadge} setIsOpenBadge={() => { setIsOpenBadge(!isOpenBadge) }} />
                    </div>
                    <button
                        className={`bg-grey rounded-lg py-2 px-3 text-sm font-bold text-black flex flex-row items-center gap-2`}
                        onClick={() => { setIsOpenAnswer(!isOpenAnswer) }}
                    >
                        <Image src={iconSend} alt='' width={24} height={24} />
                        Reply
                    </button>
                </div>
            </div>
            {openReplies.has(comment.id) && (
                <></>
            )}
            {isOpenAnswer && (
                <div className='w-full flex flex-row items-center justify-between gap-3'>
                    <div className='w-full px-5 py-3 bg-grey text-black rounded-lg'>
                        <textarea
                            className='bg-grey w-full text-sm font-normal focus-within:outline-none'
                            placeholder='Type here to reply...'
                            rows={3}
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                        >
                        </textarea>
                    </div>
                    <div className='flex flex-row items-center gap-2'>
                        <button
                            className={`bg-grey rounded-lg py-3 px-4 text-sm font-bold text-black`}
                            onClick={() => { setIsOpenAnswer(!isOpenAnswer) }}
                        >
                            Cancel
                        </button>
                        <button
                            className={`bg-green rounded-lg py-3 px-4 text-sm font-bold text-black`}
                            onClick={handleReply}
                        >
                            Reply
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Comment