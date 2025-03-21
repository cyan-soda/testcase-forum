'use client'

import Image from 'next/image'
import { useState } from 'react'

import iconSend from '@/icons/send.svg'
import { LikeButton, CommentButton, BadgeButton } from "@/components/shared/buttons"
import { CommentProps } from '../details'

const Comment = ({ comment, replies }: { comment: CommentProps, replies?: CommentProps[] }) => {
    const [isOpenBadge, setIsOpenBadge] = useState(false)
    const [isOpenAnswer, setIsOpenAnswer] = useState(false)
    const [openReplies, setOpenReplies] = useState<Set<number>>(new Set())

    const toggleReply = (commentId: number) => {
        setOpenReplies((prev) => {
            const newState = new Set(prev)
            if (newState.has(commentId)) {
                newState.delete(commentId)
            } else {
                newState.add(commentId)
            }
            return newState
        })
    }

    // Find replies to this comment
    const childReplies = replies?.filter(reply => reply.parent_id === comment.id)

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
                        <LikeButton like_count={comment?.like_count} />
                        {/* Toggle replies when clicking the comment button */}
                        <CommentButton count={comment.comment_count} onClick={() => toggleReply(comment.id)} />
                        <BadgeButton count={comment.badge_count} isOpenBadge={isOpenBadge} setIsOpenBadge={() => setIsOpenBadge(!isOpenBadge)} />
                    </div>
                    <button
                        className={`bg-grey rounded-lg py-2 px-3 text-sm font-bold text-black flex flex-row items-center gap-2`}
                        onClick={() => setIsOpenAnswer(!isOpenAnswer)}
                    >
                        <Image src={iconSend} alt='' width={24} height={24} />
                        Reply
                    </button>
                </div>
            </div>

            {/* Display replies if open */}
            {openReplies.has(comment.id) && (childReplies ?? []).length > 0 && (
                <div className='w-full pl-10 border-l-2 border-grey'>
                    {childReplies?.map(reply => (
                        <Comment key={reply.id} comment={reply} replies={replies} />
                    ))}
                </div>
            )}

            {/* Reply input box */}
            {isOpenAnswer && (
                <div className='w-full flex flex-row items-center justify-between gap-3'>
                    <div className='w-full px-5 py-3 bg-grey text-black rounded-lg'>
                        <textarea
                            className='bg-grey w-full text-sm font-normal focus-within:outline-none'
                            placeholder='Type here to reply...'
                            rows={3}
                        />
                    </div>
                    <div className='flex flex-row items-center gap-2'>
                        <button
                            className='bg-grey rounded-lg py-3 px-4 text-sm font-bold text-black'
                            onClick={() => setIsOpenAnswer(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className='bg-green rounded-lg py-3 px-4 text-sm font-bold text-black'
                            onClick={() => setIsOpenAnswer(false)}
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
