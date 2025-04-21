import Image from "next/image"

import iconRightArrowBold from '@/icons/right-arrow-bold.svg'
import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { postService } from "@/service/post"

const Item = ({ id, title, author }: { id: string, title: string, author: string }) => {
    const { t } = useTranslation('home')
    return (
        <div
            className={`w-full flex flex-col items-start gap-2 rounded-xl p-3 text-black hover:bg-grey hover:cursor-pointer`}
            onClick={() => { window.open(`/space/CO1005/242/${id}`, '_blank') }}
        >
            <div className="flex flex-row items-center gap-2 w-full">
                <span className="flex-grow text-xs leading-[18px] font-semibold whitespace-normal break-words break-all">{title}</span>
                <Image src={iconRightArrowBold} alt="" />
            </div>
            <span className="text-[10px] leading-4 font-normal">{t('discussion_section.by')} {author}</span>
        </div>
    )
}

interface IPost {
    id: string,
    title: string,
    author: string,
    hot_score: number,
}

const PopularPosts = () => {
    const { t } = useTranslation('home')
    const [popularPosts, setPopularPosts] = useState<IPost[]>([])

    useEffect(() => {
        const fetchPopularPosts = async () => {
            try {
                const response = await postService.getPopularPosts()
                setPopularPosts(response)
            } catch (error) {
                console.error('Error fetching popular posts:', error)
            }
        }

        fetchPopularPosts()
    }, [])

    return (
        <div className="flex flex-col gap-5 p-2 bg-white rounded-2xl border border-black">
            <button className="flex flex-row gap-2 items-center p-3 pb-0">
                <span className="text-base font-semibold hover:underline">{t('discussion_section.title')}</span>
                <Image src={iconRightArrowBold} alt="" />
            </button>
            <div className="flex flex-col gap-2">
                {popularPosts.map((post) => (
                    <Item key={post.id} id={post.id} title={post.title} author={post.author} />
                ))}
            </div>
        </div>
    )
}

export default PopularPosts