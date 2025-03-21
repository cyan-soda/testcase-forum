'use client'

import Image from "next/image"
import { useState } from "react"

import iconLike from '@/icons/like.svg'
import iconDislike from '@/icons/dislike.svg'
import iconLikeActive from '@/icons/like-active.svg'
import iconDislikeActive from '@/icons/dislike-active.svg'
import iconCommnent from '@/icons/message.svg'
import iconBadge from '@/icons/medal-star.svg'


export const LikeButton = ({like_count}: {like_count: number}) => {
    const [liked, setLiked] = useState(false)
    const [disliked, setDisliked] = useState(false)
    const [count, setCount] = useState(like_count)

    const handleLike = () => {
        if (liked) {
            setLiked(false)
            setCount(count - 1)
        } else {
            if (disliked) {
                setDisliked(false);
                setCount(count + 1);
            }
            setLiked(true)
            setCount(count + 1)
        } 
    }

    const handleDislike = () => {
        if (disliked) {
            setDisliked(false)
            setCount(count + 1)
        } else {
            if (liked) {
                setLiked(false);
                setCount(count - 1);
            }
            setDisliked(true)
            setCount(count - 1)
        } 
    }
    return (
        <div className="flex flex-row items-center gap-2 bg-grey rounded-lg px-4 py-2">
            <button onClick={handleLike}>
                <Image src={liked ? iconLikeActive : iconLike} alt="" width={24} height={24} />
            </button>
            <span>{count}</span>
            <button onClick={handleDislike}>
                <Image src={disliked ? iconDislikeActive : iconDislike} alt="" width={24} height={24} />
            </button>
        </div>
    )
}

export const CommentButton = ({ count, isOpenComment, setIsOpenComment }: { count: number, isOpenComment?: boolean, setIsOpenComment?: () => void, onClick?: () => void }) => {
    return (
        <button className="flex flex-row items-center gap-2 bg-grey rounded-lg px-4 py-2" onClick={setIsOpenComment}>
            <Image src={iconCommnent} alt="" width={24} height={24} />
            <span>{count}</span>
        </button>
    )
}

export const BadgeButton = ({ count, isOpenBadge, setIsOpenBadge }: { count: number, isOpenBadge?: boolean, setIsOpenBadge?: () => void }) => {
    return (
        <button className="flex flex-row items-center gap-2 bg-grey rounded-lg px-4 py-2" onClick={setIsOpenBadge}>
            <Image src={iconBadge} alt="" width={24} height={24} />
            <span>{count}</span>
        </button>
    )
}