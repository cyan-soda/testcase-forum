import Image from 'next/image'

import iconRightArrow from '@/icons/arrow--right.svg'

const RecPosts = ({ title, author, link }: {title: string, author: string, link: string}) => {
    return (
        <div className="flex flex-row items-center justify-between w-full cursor-pointer bg-grey hover:bg-opacity-60 p-3 pr-6 rounded-lg">
            <div className="flex flex-col items-start gap-[6px]">
                <span className="text-sm font-semibold hover:underline">{title}</span>
                <span className="text-xs font-normal">{author}</span>
            </div>
            <Image src={iconRightArrow} alt="" width={20} height={20} />
        </div>
    )
}

export default RecPosts