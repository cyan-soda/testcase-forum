'use client';

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebouncedCallback } from 'use-debounce';

import PostCard from "@/components/home/card";
import PopularPosts from "@/components/home/popular/posts";
import SearchFilterField from "@/components/home/utils/search-filter";
import SearchTextField from "@/components/home/utils/search-text";
import { postService } from "@/service/post";
import { useTranslation } from "react-i18next";
import { TPost } from "@/types/post";
import { usePostStore } from "@/store/post/post-store";

const CoursePage = () => {
  const params = useParams();
  const { course, term } = params as { course: string; term: string };
  const { posts, setPosts } = usePostStore();
  const [filteredPosts, setFilteredPosts] = useState<TPost[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [sortFilter, setSortFilter] = useState<string>("");
  const [suggestedPosts, setSuggestedPosts] = useState<TPost[]>([]);
  const [normalPosts, setNormalPosts] = useState<TPost[]>([]);
  const [displayedNormalCount, setDisplayedNormalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

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
        setLoading(true)
        const suggestData = await postService.getSuggestedPosts();
        const allData = await postService.getAllPosts();

        const formatPosts = (data: TPost[]) =>
          data.map((item: TPost) => ({
            ...item,
            last_modified: new Date(item.last_modified).toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }),
          }));

        if (suggestData && allData) {
          const formattedSuggested = formatPosts(suggestData);
          const formattedNormal = formatPosts(allData).filter(
            (post) => !suggestData.some((s: TPost) => s.id === post.id)
          );

          setSuggestedPosts(formattedSuggested);
          setNormalPosts(formattedNormal);
          setPosts([...formattedSuggested]); // Initialize store with suggested posts
        }
      } catch (error) {
        setLoading(false)
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false)
      }
    };

    fetchData();
  }, [course, term, setPosts]);

  // Combine and filter posts
  useEffect(() => {
    // Combine suggested posts with the currently displayed normal posts
    let result = [...suggestedPosts, ...normalPosts.slice(0, displayedNormalCount)];

    // Apply search text filter
    if (searchText) {
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchText.toLowerCase()) ||
          post.description.toLowerCase().includes(searchText.toLowerCase())
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
  }, [suggestedPosts, normalPosts, displayedNormalCount, searchText, sortFilter]);

  // Search text handler
  const debounced = useDebouncedCallback((text: string) => {
    setSearchText(text);
  }, 100);

  // Sort handler
  const handleFilterChange = (selected: string) => {
    setSortFilter(selected);
  };

  // See more button handler
  const handleSeeMore = () => {
    const nextCount = displayedNormalCount + 5;
    setDisplayedNormalCount(nextCount);
  };

  return (
    <div className="min-h-screen bg-white text-black pr-10 pt-5 pb-10 flex flex-row gap-5">
      <div className="flex flex-col gap-5 w-3/4">
        <div className="w-full flex flex-col gap-3 p-5 rounded-2xl border border-black">
          <SearchTextField
            value={searchText}
            onChange={(e: string) => debounced(e)}
          />
          <SearchFilterField
            value={sortFilter}
            onChange={handleFilterChange}
            availableOptions={SORT_OPTIONS}
          />
        </div>
        <div className="flex flex-col gap-6">
          {loading && (
            <div className="w-full flex flex-col gap-1 items-center justify-center h-full">
              {/* <span className="text-sm font-normal">{t('run_code.loading_recommended_posts')}</span> */}
              <div className="flex items-center justify-center my-3">
                <div className="w-10 h-10 border-2 border-t-transparent border-black rounded-full animate-spin"></div>
              </div>
            </div>
          )}
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {displayedNormalCount < normalPosts.length && (
            <button
              onClick={handleSeeMore}
              className="self-center px-3 py-2 bg-black text-white rounded-lg text-sm font-medium"
            >
              {t('see_more_button')}
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-5 w-1/4">
        <PopularPosts />
      </div>
    </div>
  );
};

export default CoursePage;