'use client'

import Image from "next/image"
import { useState } from "react"

import iconLike from '@/icons/like.svg'
// import iconDislike from '@/icons/dislike.svg'
import iconLikeActive from '@/icons/like-active.svg'
// import iconDislikeActive from '@/icons/dislike-active.svg'
import iconCommnent from '@/icons/message.svg'
import iconBadge from '@/icons/medal-star.svg'
import { postService } from "@/service/post"
// import { usePostStore } from "@/store/post/post-store"
import { TPost } from "@/types/post"


export const LikeButton = ({
  post,
  initialLiked = false,
}: {
  post: TPost;
  initialLiked?: boolean;
}) => {
  const [loading, setLoading] = useState(false);

  const initialLikeId = post?.interaction?.like_id;
  const [liked, setLiked] = useState(initialLikeId !== null ? true : initialLiked);
  const [count, setCount] = useState(post?.interaction?.like_count ?? 0);

  const handleLike = async () => {
    if (loading || !post) return;
  
    const prevLiked = liked;
    const prevCount = count;
  
    // Optimistically update UI
    setLiked(!prevLiked);
    setCount(prevLiked ? prevCount - 1 : prevCount + 1);
    setLoading(true);
  
    try {
      const res = await postService.likePost(post.id); // returns { id, is_like }
  
      if (typeof res?.is_like === "boolean") {
        setLiked(res.is_like);
  
        // Always calculate from prevCount — NOT the currently shown state
        const correctedCount = res.is_like
          ? (prevLiked ? prevCount : prevCount + 1)
          : (prevLiked ? prevCount - 1 : prevCount);
  
        setCount(correctedCount);
      } else {
        // Invalid response, revert
        setLiked(prevLiked);
        setCount(prevCount);
      }
    } catch (err) {
      console.error("Error liking post:", err);
      // Revert everything
      setLiked(prevLiked);
      setCount(prevCount);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex flex-row items-center gap-2 bg-grey rounded-lg px-4 py-2">
      <button onClick={handleLike} disabled={loading}>
        <Image
          src={liked ? iconLikeActive : iconLike}
          alt={liked ? "Unlike" : "Like"}
          width={24}
          height={24}
        />
      </button>
      <span>{count}</span>
    </div>
  );
};

export const CommentButton = ({ count, setIsOpenComment }: { count: number, setIsOpenComment?: () => void, }) => {
  return (
    <button className="flex flex-row items-center gap-2 bg-grey rounded-lg px-4 py-2" onClick={setIsOpenComment}>
      <Image src={iconCommnent} alt="" width={24} height={24} />
      <span>{count}</span>
    </button>
  )
}

export const BadgeButton = ({ count, setIsOpenBadge }: { count: number, setIsOpenBadge?: () => void }) => {
  return (
    <button className="flex flex-row items-center gap-2 bg-grey rounded-lg px-4 py-2" onClick={setIsOpenBadge}>
      <Image src={iconBadge} alt="" width={24} height={24} />
      <span>{count}</span>
    </button>
  )
}