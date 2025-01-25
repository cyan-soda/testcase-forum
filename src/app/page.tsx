'use client';
import React from "react";
import { useEffect, useState } from "react";
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
export default function Home() {
    const [POST, setPosts] = useState<PostData[]>([]);

    useEffect(() => {
      const fetchData = async () => {
        const res = await fetch('http://127.0.0.1:3000/posts');
        const json: Post[] = await res.json();
  

        const formattedPosts: PostData[] = json.map(item => ({
          id: item.id,
          title: item.title,
          tags: ['assignment1', 'ultimate', 'infinity void', 'programming'],
          description: item.description,
          date: item.created_at,
          author: item.user_mail,
          reactions: {
            star: 145,
            comment: 56,
            view: 324,
            badge: 2,
          }
        }));
  
        setPosts(formattedPosts);
      };
  
      fetchData();
    }, []);

  return (
    <div className="min-h-screen bg-white text-black pr-10 pt-5 pb-10 flex flex-row gap-5">
      
    </div>
  );
}
