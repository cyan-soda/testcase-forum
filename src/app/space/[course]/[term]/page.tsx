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
  testcase: {
    input: string;
    expected: string;
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
    testcase: {
        input: string;
        expected: string;
    };
}

const CoursePage = () => {
  const params = useParams(); 
  const { course, term } = params as { course: string; term: string }; 

  const [POST, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:3000/posts`);
        const json: Post[] = await res.json();

        const formattedPosts: PostData[] = json.map((item) => ({
          id: item.id,
          title: item.title,
          tags: ["assignment1", "ultimate", "infinity void", "programming"], 
          description: item.description,
          date: new Date(item.created_at).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // Use 24-hour format; remove this line for 12-hour format
          }),
          author: item.user_mail.split('@')[0],
          reactions: {
            star: 145, 
            comment: 56,
            view: 324,
            badge: 2,
          },
          testcase: {
            input: item.testcase.input,
            expected: item.testcase.expected,
          },
        }));

        setPosts(formattedPosts);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [course, term]);

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
