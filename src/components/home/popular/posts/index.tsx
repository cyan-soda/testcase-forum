import Image from "next/image"

import iconRightArrowBold from '@/icons/right-arrow-bold.svg'
import { useTranslation } from "react-i18next"

const POSTS = [
    {   
        id: 0,
        title: 'I have found the ultimate test cases for this assignment',
        author: 'Naomi Nguyen'
    },
    {
        id: 1,
        title: 'How to solve the last question in the assignment',
        author: 'Naomi Nguyen'
    },
    {
        id: 2,
        title: 'How to solve the last question in the assignment',
        author: 'Naomi Nguyen'
    },
]

const Item = ({ title, author }: { title: string, author: string }) => {
    const { t } = useTranslation('home')
    return (
        <div className={`flex flex-col items-start gap-2 rounded-xl p-3 text-black hover:bg-grey hover:cursor-pointer`}>
            <div className="flex flex-row items-center gap-2">
                <span className="text-xs leading-[18px] font-semibold">{title}</span>
                <Image src={iconRightArrowBold} alt="" />
            </div>
            <span className="text-[10px] leading-4 font-normal">{t('discussion_section.by')} {author}</span>
        </div>
    )
}

const PopularPosts = () => {
    const { t } = useTranslation('home')
    return (
        <div className="flex flex-col gap-5 p-2 bg-white rounded-2xl border border-black">
            <button className="flex flex-row gap-2 items-center p-3 pb-0">
                <span className="text-base font-semibold hover:underline">{t('discussion_section.title')}</span>
                <Image src={iconRightArrowBold} alt="" />
            </button>
            <div className="flex flex-col gap-2">
                {POSTS.map((post) => (
                    <Item key={post.id} title={post.title} author={post.author} />
                ))}
            </div>
        </div>
    )
}

export default PopularPosts