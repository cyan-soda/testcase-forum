import PostCard from "@/components/home/card";
import PopularPosts from "@/components/home/popular/posts";
import PopularTags from "@/components/home/popular/tags";
import UtilSection from "@/components/home/utils";
import Image from "next/image";

const POST = [
  {
      id: 0,
      title: 'I have found the ultimate test cases for this assignment',
      tags: ['assignment1', 'ultimate', 'infinity void', 'programming'],
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      author: 'Naomi Nguyen',
      date: '2 days ago',
      reactions: {
          star: 145,
          comment: 56,
          view: 324,
          badge: 2,
      }
  },
  {
      id: 1,
      title: 'How to solve the last question in the assignment',
      tags: ['assignment1', 'question', 'programming'],
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      author: 'Naomi Nguyen',
      date: '2 days ago',
      reactions: {
          star: 145,
          comment: 56,
          view: 324,
          badge: 2,
      }
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black pr-10 pt-5 pb-10 flex flex-row gap-5">
      <div className="flex flex-col gap-5 w-3/4">
        <UtilSection />
        <div className="flex flex-col gap-6">
          {POST.map((post) => (
            <PostCard key={post.id} post={post}  />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-5 w-1/4">
        <PopularPosts />
        <PopularTags />
      </div>
    </div>
  );
}
