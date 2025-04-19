'use client';

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebouncedCallback } from 'use-debounce';

import PostCard from "@/components/home/card";
import PopularPosts from "@/components/home/popular/posts";
import PopularTags from "@/components/home/popular/tags";
import SearchFilterField from "@/components/home/utils/search-filter";
import SearchTagField from "@/components/home/utils/search-tag";
import SearchTextField from "@/components/home/utils/search-text";
import { postService } from "@/service/post";
import { useTranslation } from "react-i18next";
import { TPost } from "@/types/post";
import { usePostStore } from "@/store/post/post-store";
import { set } from "react-hook-form";
import { useUserStore } from "@/store/user/user-store";

const CoursePage = () => {
  const params = useParams();
  const { course, term } = params as { course: string; term: string };
  const { posts, setPosts } = usePostStore()
  const [filteredPosts, setFilteredPosts] = useState<TPost[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [sortFilter, setSortFilter] = useState<string>("");
  const { user } = useUserStore()

  // Translation and sort options at top level
  const { t } = useTranslation("home");
  const SORT_OPTIONS = [
    t('filter_options.all'),
    t('filter_options.new'),
    t('filter_options.old'),
    t('filter_options.a_z'),
    t('filter_options.z_a'),
  ];

  // Fetch posts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await postService.getAllPosts();
        setPosts(res as TPost[]);
        console.log("Post page: ", res);
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
              like_count: item.interaction?.like_count || 0,
              comment_count: item.interaction?.comment_count || 0,
              like_id: item.interaction?.like_id || null,
              verified_teacher_mail: item.interaction?.verified_teacher_mail || null,
              view_count: item.interaction?.view_count || 0,
              run_count: item.interaction?.run_count || 0,
            },
          }));
          setPosts(formattedPosts);
          // console.log("Formatted posts:", formattedPosts);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [course, term]);

  // Combine all filters
  useEffect(() => {
    let result = [...posts];

    // Apply search text filter
    if (searchText) {
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchText.toLowerCase()) ||
          post.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply tag filter
    if (tags.length > 0) {
      result = result.filter((post) =>
        tags.some((tag) => post.tags.includes(tag))
      );
    }

    // Apply sort filter
    switch (sortFilter) {
      case SORT_OPTIONS[0]: // "All"
        break;
      case SORT_OPTIONS[1]: // "Newest"
        result.sort((a, b) => new Date(b.last_modified).getTime() - new Date(a.last_modified).getTime());
        break;
      case SORT_OPTIONS[2]: // "Oldest"
        result.sort((a, b) => new Date(a.last_modified).getTime() - new Date(b.last_modified).getTime());
        break;
      case SORT_OPTIONS[3]: // "A-Z"
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case SORT_OPTIONS[4]: // "Z-A"
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    setFilteredPosts(result);
  }, [posts, searchText, tags, sortFilter]);

  // Search text handler
  const debounced = useDebouncedCallback((text: string) => {
    setSearchText(text);
  }, 100);

  // Tag handler
  const availableTags = ['assignment1', 'ultimate', 'infinity void', 'programming', 'homework', 'project', 'exam', 'test'];
  const handleTagChange = (selectedTags: string[]) => {
    setTags(selectedTags);
  };

  // Sort handler
  const handleFilterChange = (selected: string) => {
    setSortFilter(selected);
  };

  return (
    <div className="min-h-screen bg-white text-black pr-10 pt-5 pb-10 flex flex-row gap-5">
      
      <div className="flex flex-col gap-5 w-3/4">
        <div className="w-full flex flex-col gap-3 p-5 rounded-2xl border border-black">
          <SearchTextField
            value={searchText}
            onChange={(e: string) => debounced(e)}
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
            <PostCard key={post.id} post_id={post.id} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-5 w-1/4">
        <PopularPosts />
        {/* <PopularTags /> */}
      </div>
    </div>
  );
};

export default CoursePage;