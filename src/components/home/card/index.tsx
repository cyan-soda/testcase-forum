'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import iconStar from '@/icons/star.svg'
import iconComment from '@/icons/message.svg'
import iconView from '@/icons/eye.svg'
import iconBadge from '@/icons/medal-star.svg'
import iconRightArrow from '@/icons/arrow--right.svg'
const PreviewPopup = dynamic(() => import('@/components/shared/popup-preview'), { ssr: false })
import { useTranslation } from 'react-i18next'
import { TPost } from '@/types/post'
import { usePostStore } from '@/store/post/post-store'
import { postService } from '@/service/post'

const Reaction = ({ count, icon }: { count: number, icon: string }) => {
    return (
        <div className="flex flex-row gap-2 items-center justify-end text-sm text-end text-black font-normal">
            <span>{count}</span>
            <Image src={icon} alt="" />
        </div>
    )
}

export const Tag = ({ tag }: { tag: string }) => {
    return (
        <button className='bg-grey rounded-[20px] px-[10px] py-1 text-xs font-semibold'>
            {tag}
        </button>
    )
}

const getInitials = (name: string) => {
    const names = name.split(' ')
    if (names.length === 1) return names[0][0]
    return `${names[names.length - 1][0]}${names[0][0]}`
}

const PostCard = ({ post_id }: { post_id: string }) => {
    const post = usePostStore((state) => state.posts.find((post) => post.id === post_id)) as TPost
    const [isOpenPreviewPopup, setIsOpenPreviewPopup] = useState(false)
    const handleOpenPreviewPopup = () => {
        setIsOpenPreviewPopup(true)

    }


    const router = useRouter()
    const { course, term } = useParams()
    const handlePostDetailClick = (post: any) => {
        course && term && router.push(`/space/${course}/${term}/${post.id}`)

        postService.clickPost(post.id, post.post_type).then((res) => {
            console.log('Post clicked:', res)
        }).catch((err) => {
            console.error('Error clicking post:', err)
        })
    }

    const { t } = useTranslation('home')

    return (
        <>
            <div className="w-full flex flex-row gap-6 bg-white text-black px-6 py-5 rounded-2xl border border-black border-b-[3px]">
                <div className='flex flex-col gap-5'>
                    <Reaction count={post.interaction?.like_count} icon={iconStar} />
                    <Reaction count={post.interaction?.comment_count} icon={iconComment} />
                    <Reaction count={post.interaction?.view_count} icon={iconView} />
                    <Reaction count={post.interaction?.verified_teacher_mail ? 1 : 0} icon={iconBadge} />
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
                        <div className='w-1/4 flex flex-col items-center justify-start overflow-hidden'>
                            <div className='flex flex-row items-center gap-[10px] '>
                                <div className='rounded-full p-2 bg-grey h-10 w-10 text-black flex items-center justify-center'>{getInitials(post.author)}</div>
                                <div className='flex flex-col items-start gap-1'>
                                    <span className='text-base font-semibold flex-1'>{post.author}</span>
                                    <span className='text-sm font-normal'>{post.last_modified}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row gap-3 items-center justify-end mt-auto'>
                        <button
                            className={`bg-grey rounded-lg py-2 px-3 text-sm font-bold text-black`}
                            onClick={() => { handleOpenPreviewPopup() }}
                        >
                            {t('cards.preview_button')}
                        </button>
                        <button
                            className={`flex flex-row items-center gap-[6px] bg-green rounded-lg py-2 px-3 text-sm font-bold text-black`}
                            onClick={() => { handlePostDetailClick(post) }}
                        >
                            <span>{t('cards.details_button')}</span>
                            <Image src={iconRightArrow} alt='' />
                        </button>
                    </div>
                </div>
            </div>
            <PreviewPopup isOpen={isOpenPreviewPopup} onClose={() => setIsOpenPreviewPopup(false)} testcase={post.testcase} />
        </>
    )
}

export default PostCard