'use client'

import Image from "next/image"
import { useEffect, useState } from "react"

import iconLike from '@/icons/like.svg'
import iconDislike from '@/icons/dislike.svg'
import iconLikeActive from '@/icons/like-active.svg'
import iconDislikeActive from '@/icons/dislike-active.svg'
import iconCommnent from '@/icons/message.svg'
import iconBadge from '@/icons/medal-star.svg'
import { postService } from "@/service/post"


export const LikeButton = ({ like_count, post_id }: { like_count: number, post_id: string }) => {
    const [liked, setLiked] = useState(false)
    const [count, setCount] = useState(like_count)
    const [loading, setLoading] = useState(false)

    // useEffect(() => {
    //     setCount(like_count)
    //     const fetchLikeStatus = async () => {
    //         try {
    //             const res = await postService.likePost(post_id)
    //             setLiked(!!res?.isLiked)
    //         } catch (error) {
    //             console.error("Error fetching like status:", error)
    //         }
    //     };
    //     fetchLikeStatus()
    // }, [like_count, post_id]);

    const handleLike = async () => {
        try {
            const res = await postService.likePost(post_id)
            setLiked(!liked)
            if (res.status === 200) {
                setCount(liked ? count - 1 : count + 1)
            }
        } catch (error) {
            console.error("Error liking the post:", error)
        }
    }

    return (
        <div className="flex flex-row items-center gap-2 bg-grey rounded-lg px-4 py-2">
            <button onClick={handleLike}>
                <Image src={liked ? iconLikeActive : iconLike} alt="" width={24} height={24} />
            </button>
            <span>{count}</span>
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