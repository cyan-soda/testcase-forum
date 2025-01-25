'use client';

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

import PostCard from "@/components/home/card";
import PopularPosts from "@/components/home/popular/posts";
import PopularTags from "@/components/home/popular/tags";
import UtilSection from "@/components/home/utils";

interface Post {
  id: string;
  title: string;
  description: string;
  created_at: string;
  user_mail: string;
  reactions: {
    star: number;
    comment: number;
    view: number;
    badge: number;
  };
}

interface PostData {
  id: string;
  title: string;
  tags: string[];
  description: string;
  date: string;
  author: string;
  reactions: {
    star: number;
    comment: number;
    view: number;
    badge: number;
  };
}

const CoursePage = () => {
  const params = useParams(); // Lấy các tham số từ URL
  const { postId } = params as { postId: string }; // Lấy postId từ params

  const [POST, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:3000/posts/${postId}`);
        const json: Post[] = await res.json();

        const formattedPosts: PostData[] = json.map((item) => ({
          id: item.id,
          title: item.title,
          tags: ["assignment1", "ultimate", "infinity void", "programming"], // Gắn cứng tags mẫu
          description: item.description,
          date: item.created_at,
          author: item.user_mail,
          reactions: {
            star: 145, // Mock dữ liệu reactions
            comment: 56,
            view: 324,
            badge: 2,
          },
        }));

        setPosts(formattedPosts);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    if (postId) {
      fetchData();
    }
  }, [postId]);

  return (
    <div className="min-h-screen bg-white text-black pr-10 pt-5 pb-10 flex flex-row gap-5">
      <div className="flex flex-col gap-5 w-3/4">
        <UtilSection />
        <div className="flex flex-col gap-6">
          {POST.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-5 w-1/4">
        <PopularPosts />
        <PopularTags />
      </div>
    </div>
  );
};

export default CoursePage;
