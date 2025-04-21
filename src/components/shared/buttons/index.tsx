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
import { usePostStore } from "@/store/post/post-store"


export const LikeButton = ({
  like_count,
  post_id,
  initialLiked = false,
}: {
  like_count: number;
  post_id: string;
  initialLiked?: boolean;
}) => {
  const { getPostById, setPostById } = usePostStore();
  const post = getPostById(post_id);
  const initialLikeId = post?.interaction?.like_id;
  const [liked, setLiked] = useState(initialLikeId !== null ? true : initialLiked);
  const [count, setCount] = useState(post?.interaction?.like_count ?? like_count);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;

    const post = getPostById(post_id);
    if (!post) return;

    const wasLiked = post.interaction?.like_id !== null;
    const prevCount = post.interaction?.like_count;

    // console.log("Post before like:", post.interaction?.like_id, post.interaction?.like_count);

    const optimisticLiked = !wasLiked;
    const optimisticCount = wasLiked ? prevCount - 1 : prevCount + 1;

    setLiked(optimisticLiked);
    setCount(optimisticCount);
    setLoading(true);

    try {
      const res = await postService.likePost(post_id); // returns { id, is_like }

      const newLikeId = res.is_like ? res.id : null;

      setPostById(post_id, {
        interaction: {
          ...post.interaction,
          like_id: newLikeId,
          like_count: optimisticCount,
        },
      });
    } catch (err) {
      console.error("Error liking post:", err);
      // Revert on failure
      setLiked(wasLiked);
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