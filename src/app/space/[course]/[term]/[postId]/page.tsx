'use client'

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import iconArrow from '@/icons/arrow--right.svg'
import PostDetails from "@/components/post/details";
import { POST } from "../page";
import RunCode from "@/components/post/run-code";

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
    const { space, course, term, postId } = useParams<{ space: string, course: string, term: string, postId: string }>()
    const router = useRouter()

    const [activeTab, setActiveTab] = useState<'details' | 'runCode'>('details')

    const handleToggleTab = (tab: 'details' | 'runCode') => {
        setActiveTab(tab)
    }

    return (
        <div className="min-h-screen bg-white text-black pr-10 pt-5 pb-10 flex flex-col gap-8">
            <button
                className={`bg-grey rounded-lg py-2 px-3 text-black font-bold text-sm w-fit flex flex-row gap-[6px] items-center`}
                onClick={() => router.back()}
            >
                <Image src={iconArrow} alt="" width={20} height={20} style={{ transform: 'scaleX(-1)' }} />
                <p>Back</p>
            </button>

            <div className="flex flex-col items-center">
                <div className="flex flex-row items-center">
                    <Tab 
                        title="Post Details" 
                        isActive={activeTab === 'details'} 
                        onClick={() => handleToggleTab('details')} 
                    />
                    <Tab 
                        title="Run Code" 
                        isActive={activeTab === 'runCode'} 
                        onClick={() => handleToggleTab('runCode')} 
                    />
                </div>

                <div className="w-full bg-grey rounded-2xl p-7">
                    {activeTab === 'details' && (
                        <PostDetails post={POST[parseInt(postId)]} />
                    )}

                    {activeTab === 'runCode' && (
                        <RunCode  />
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostDetailPage;
