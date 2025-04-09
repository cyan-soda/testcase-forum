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
import { postService } from "@/service/post";
import { useTranslation } from "react-i18next";
import { TPost } from "@/types/post";

const CoursePage = () => {
  const params = useParams();
  const { course, term } = params as { course: string; term: string };

  const [POST, setPosts] = useState<TPost[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await postService.getAllPosts()
        console.log("Post page: ", res)
        if (res) {
          const formattedPosts: TPost[] = (res as TPost[]).map((item: TPost) => ({
            id: item.id,
            user_mail: item.user_mail,
            author: item.author,
            subject: item.subject,
            title: item.title,
            description: item.description,
            last_modified: new Date(item.last_modified).toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }),
            testcase: {
              post_id: item.testcase.post_id || "",
              input: item.testcase.input || "",
              expected: item.testcase.expected || "",
              code: item.testcase.code,
            },
            tags: ["assignment1", "ultimate", "infinity void", "programming"],
            post_type: 0,
            interaction: {
              like_count: item.interaction.like_count || 0,
              comment_count: item.interaction.comment_count || 0,
              like_id: item.interaction.like_id,
              verified_teacher_mail: item.interaction.verified_teacher_mail,
              view_count: item.interaction.view_count || 0,
              run_count: item.interaction.run_count || 0,
            },
          }));
          setPosts(formattedPosts);
          console.log(formattedPosts);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [course, term]);

  // Filtered posts based on search text
  const [filteredPosts, setFilteredPosts] = useState<TPost[]>(POST);
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
  const { t } = useTranslation("home")
  const SORT_OPTIONS = [t('filter_options.all'), t('filter_options.new'), t('filter_options.old'), t('filter_options.a_z'), t('filter_options.z_a')];
  const [sortFilter, setSortFilter] = useState<string>("");
  const handleFilterChange = (selected: string) => {
    setSortFilter(selected);
    setFilteredPosts((prevPosts) => {
      const sortedPosts = [...prevPosts];
      switch (selected) {
        case "All":
          return POST;
        case "Newest":
          return sortedPosts.sort((a, b) => new Date(b.last_modified).getTime() - new Date(a.last_modified).getTime());
        case "Oldest":
          return sortedPosts.sort((a, b) => new Date(a.last_modified).getTime() - new Date(b.last_modified).getTime());
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
