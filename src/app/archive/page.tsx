'use client'

import Image from "next/image"
// import { useParams } from "next/navigation"
import { useState } from "react"

import iconHouse from '@/icons/house.svg'
import MyPosts from "@/components/archive/my-posts"
import MyLikedPosts from "@/components/archive/my-liked-posts"
import MyCommentedPosts from "@/components/archive/my-commented-posts"
import { useTranslation } from "react-i18next"

const ArchivePage = () => {
    const { t } = useTranslation('archive')

    const USER_OPTIONS = [
        { id: 0, title: t('my_posts.title')},
        { id: 1, title: t('my_liked_posts.title')},
        { id: 2, title: t('my_commented_posts.title')},
    ]

    const [activeTab, setActiveTab] = useState<string>(t('my_posts.title'))
    const handleClickTab = (title: string) => {
        setActiveTab(title)
    }

    return (
        <div className="min-h-screen bg-white text-black pr-6 gap-8 flex flex-row w-full">
            <div className="w-1/6 flex flex-col py-8 gap-8 items-start justify-start border-r-grey border-r-2">
                <div className="flex flex-row items-center justify-start gap-2 px-5">
                    <Image src={iconHouse} height={24} width={24} alt="home-icon" />
                    <p className="text-lg font-bold">{t('my_archive')}</p>
                </div>
                <div className="flex flex-col gap-2 items-start justify-start w-full">
                    {USER_OPTIONS.map((item) => (
                        <button
                            key={item.id}
                            className={`w-full px-5 py-4 text-base font-medium text-black
                        hover:bg-grey hover:rounded-r-xl hover:transition-all hover:duration-300
                        ${activeTab === item.title ? "bg-green rounded-r-xl border-l-[3px] border-black font-semibold" : ""}`}
                            onClick={() => handleClickTab(item.title)}
                        >
                            <p className="text-left">{item.title}</p>
                        </button>
                    ))}
                </div>
            </div>
            <div className="w-5/6 flex flex-col py-8 gap-8 items-start justify-start">
                {activeTab === t('my_posts.title') && <MyPosts />}
                {activeTab === t('my_liked_posts.title') && <MyLikedPosts />}
                {activeTab === t('my_commented_posts.title') && <MyCommentedPosts />} 
            </div>
        </div>
    )
}

export default ArchivePage