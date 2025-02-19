'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import iconStar from '@/icons/star.svg'
import iconComment from '@/icons/message.svg'
import iconView from '@/icons/eye.svg'
import iconBadge from '@/icons/medal-star.svg'
import iconRightArrow from '@/icons/arrow--right.svg'
import PreviewPopup from '@/components/shared/popup-preview'

const Reaction = ({count, icon}:{count: number, icon: string}) => {
    return (
        <div className="flex flex-row gap-2 items-center justify-end text-sm text-end text-black font-normal">
            <span>{count}</span>
            <Image src={icon} alt="" />
        </div>
    )
}

export const Tag = ({tag}:{tag: string}) => {
    return (
        <button className='bg-grey rounded-[20px] px-[10px] py-1 text-xs font-semibold'>
            {tag}
        </button>
    )
}

export type PostCardProps = {
    id: string;
    title: string;
    tags: string[];
    description: string;
    author: string;
    date: string;
    reactions: {
        star: number;
        comment: number;
        view: number;
        badge: number;
    }
    testcase: {
        input: string;
        expected: string;
    }
}

const getInitials = (name: string) => {
    const names = name.split(' ')
    return names.map((n) => n[0]).join('')
}

const PostCard = ({post}: {post: PostCardProps}) => {
    const [isOpenPreviewPopup, setIsOpenPreviewPopup] = useState(false)
    const handleOpenPreviewPopup = () => {
        setIsOpenPreviewPopup(true)
        
    }

    const router = useRouter()
    const { course, term } = useParams()
    const handlePostDetailClick = (post: any) => {
        course && term && router.push(`/space/${course}/${term}/${post.id}`)
    }

    return (
        <>
            <div className="w-full flex flex-row gap-6 bg-white text-black px-6 py-5 rounded-2xl border border-black border-b-[3px]">
                <div className='flex flex-col gap-5'>
                    <Reaction count={post.reactions.star} icon={iconStar} />
                    <Reaction count={post.reactions.comment} icon={iconComment} />
                    <Reaction count={post.reactions.view} icon={iconView} />
                    <Reaction count={post.reactions.badge} icon={iconBadge} />
                </div>
                <div className='w-[85%] flex flex-col gap-3 flex-grow'>
                    <div className='flex flex-row gap-[10px] items-start'>
                        <div className='flex flex-col gap-[10px] w-[80%]'>
                            <span className='text-xl font-semibold'>{post.title}</span>
                            <div className='flex flex-row gap-[10px]'>
                                {post.tags.map((tag, index) => (
                                    <Tag key={index} tag={tag} />
                                ))}
                            </div>
                            <span className='max-h-[48px] h-fit overflow-hidden text-ellipsis'>{post.description}</span>
                        </div>
                        <div className='w-1/4 flex flex-row gap-[10px] items-center justify-start'>
                            <div className='rounded-full bg-grey h-10 w-10 text-black flex items-center justify-center'>{getInitials(post.author)}</div>
                            <div className='flex flex-col items-start'>
                                <div className='flex flex-row items-center gap-2'>
                                    <span className='text-base font-semibold flex-1'>{post.author}</span>
                                    <div className='bg-green rounded-full h-[6px] w-[6px]'></div>
                                </div>
                                <span className='text-sm font-normal'>{post.date}</span>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row gap-3 items-center justify-end'>
                        <button
                            className={`bg-grey rounded-lg py-2 px-3 text-sm font-bold text-black`}
                            onClick={() => {handleOpenPreviewPopup()}}
                        >
                            Preview Testcases
                        </button>
                        <button
                            className={`flex flex-row items-center gap-[6px] bg-green rounded-lg py-2 px-3 text-sm font-bold text-black`}
                            onClick={() => {handlePostDetailClick(post)}}
                        >
                            <span>See Details</span>
                            <Image src={iconRightArrow} alt='' />
                        </button>
                    </div>
                </div>
            </div>
            <PreviewPopup isOpen={isOpenPreviewPopup} onClose={() => setIsOpenPreviewPopup(false)} testcase={post.testcase}/>
        </>
    )
}

export default PostCard