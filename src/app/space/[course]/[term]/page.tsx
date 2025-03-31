'use client';

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebouncedCallback } from 'use-debounce';

import PostCard from "@/components/home/card";
import PopularPosts from "@/components/home/popular/posts";
import PopularTags from "@/components/home/popular/tags";
import SearchFilterField from "@/components/home/utils/search-filter"
import SearchTagField from "@/components/home/utils/search-tag"
import SearchTextField from "@/components/home/utils/search-text"


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
        console.log(formattedPosts);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [course, term]);

  // Filtered posts based on search text
  const [filteredPosts, setFilteredPosts] = useState<PostData[]>(POST);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    setFilteredPosts(POST);
  }, [POST]);

  const debounced = useDebouncedCallback(
    (text: string) => {
      setSearchText(text);
      setFilteredPosts(() => {
        if (!text) {
          return POST;
        }
        return POST.filter((post) =>
          post.title.toLowerCase().includes(text.toLowerCase()) ||
          post.description.toLowerCase().includes(text.toLowerCase())
        );
      });
    },
    1000
  );

  // Filtered posts based on tags
  const availableTags = ['assignment1', 'ultimate', 'infinity void', 'programming', 'homework', 'project', 'exam', 'test'];
  const [tags, setTags] = useState<string[]>([]);
  const handleTagChange = (selectedTags: string[]) => {
    setTags(selectedTags);
    setFilteredPosts(() => {
      if (selectedTags.length === 0) {
        return POST;
      }
      return POST.filter((post) =>
        selectedTags.some((tag) => post.tags.includes(tag))
      );
    });
  }

  // Filtered posts based on filter
  const SORT_OPTIONS = ["Newest", "Oldest", "A-Z", "Z-A"];
  const [sortFilter, setSortFilter] = useState<string>("");
  const handleFilterChange = (selected: string) => {
    setSortFilter(selected);
    setFilteredPosts((prevPosts) => {
      const sortedPosts = [...prevPosts];
      switch (selected) {
        case "Newest":
          return sortedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        case "Oldest":
          return sortedPosts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        case "A-Z":
          return sortedPosts.sort((a, b) => a.title.localeCompare(b.title));
        case "Z-A":
          return sortedPosts.sort((a, b) => b.title.localeCompare(a.title));
        default:
          return prevPosts;
      }
    })
  }

  return (
    <div className="min-h-screen bg-white text-black pr-10 pt-5 pb-10 flex flex-row gap-5">
      <div className="flex flex-col gap-5 w-3/4">
        <div className="w-full flex flex-col gap-3 p-5 rounded-2xl border border-black">
          <SearchTextField
            value={searchText}
            onChange={(e: string) => {
              debounced(e)
            }}
          />
          <div className="flex flex-row gap-3">
            <div className="w-2/3">
              <SearchTagField
                value={tags}
                onChange={handleTagChange}
                availableTags={availableTags}
              />
            </div>
            <div className="w-1/3">
              <SearchFilterField
                value={sortFilter}
                onChange={handleFilterChange}
                availableOptions={SORT_OPTIONS}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          {filteredPosts.map((post) => (
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
