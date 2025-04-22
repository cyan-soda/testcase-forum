'use client'

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import iconArrow from '@/icons/arrow--right.svg'
import PostDetails from "@/components/post/details";
import RunCode from "@/components/post/run-code";
import { postService } from "@/service/post";
import { usePostStore } from "@/store/post/post-store";

import { TPost } from "@/types/post";
import { useTranslation } from "react-i18next";

const Tab = ({ title, isActive, onClick }: { title: string, isActive: boolean, onClick: () => void }) => {
    return (
        <button
            className={`text-xl font-semibold border border-grey rounded-t-xl 
                ${isActive ? 'text-black bg-grey' : 'text-grey bg-white'} py-3 mx-auto w-[200px]
                hover:bg-grey hover:text-black transition-all duration-200`}
            onClick={onClick}
        >
            {title}
        </button>
    )
}

const PostDetailPage = () => {
    const { postId } = useParams<{ postId: string }>()
    console.log('postId', postId)
    const router = useRouter()
    // const { getPostById } = usePostStore()
    // const post = getPostById(postId) as TPost
    // console.log('post', post)
    const {t} = useTranslation('post')
    const [activeTab, setActiveTab] = useState<'details' | 'runCode'>('details')
    const [post, setPost] = useState<TPost | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            if (!postId) return;
            try {
                const res = await postService.getPost(postId)
                setPost(res as TPost);
                console.log('post', res)
            } catch (error) {
                console.error("Failed to fetch post data:", error);
            } 
        };

        fetchPost();
    }, [postId]);

    const handleToggleTab = (tab: 'details' | 'runCode') => {
        setActiveTab(tab)
    }

    return (
        <div className="min-h-screen bg-white text-black pr-10 pt-5 pb-10 flex flex-col gap-8">
            <button
                className={`bg-grey rounded-lg py-2 px-3 text-black font-bold text-sm w-fit flex flex-row gap-[6px] items-center`}
                onClick={() => {
                    router.back();
                    router.push('/space/CO1005/242');
                }}
            >
                <Image src={iconArrow} alt="" width={20} height={20} style={{ transform: 'scaleX(-1)' }} />
                <p>{t('back_button')} </p>
            </button>

            <div className="flex flex-col items-center">
                <div className="flex flex-row items-center">
                    <Tab 
                        title={t('post_details.title')} 
                        isActive={activeTab === 'details'} 
                        onClick={() => handleToggleTab('details')} 
                    />
                    <Tab 
                        title={t('run_code.title')} 
                        isActive={activeTab === 'runCode'} 
                        onClick={() => handleToggleTab('runCode')} 
                    />
                </div>

                <div className="w-full bg-grey rounded-2xl p-7">
                    {activeTab === 'details' && (
                        post && <PostDetails post={post} />
                    )}

                    {activeTab === 'runCode' && (
                        post && <RunCode post={post} />
                    )}
                    {!post && (
                        <div className="flex items-center justify-center my-3">
                            <div className="w-5 h-5 border-2 border-t-transparent border-black rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostDetailPage;
