import Image from 'next/image'

import iconRightArrow from '@/icons/arrow--right.svg'
import { postService } from '@/service/post'

const RecPosts = ({ title, author, id }: {title: string, author: string, id: string}) => {
    const handleClick = async (id: string) => {
        try {
            await postService.clickPost(id, 3)
        } catch (error) {
            alert("Can't open post.")
        }
        window.open(`/space/CO1005/242/${id}`, '_blank', 'noopener,noreferrer')
    }
    return (
        <div 
            className="flex flex-row items-center justify-between w-full cursor-pointer bg-grey hover:bg-opacity-60 p-3 pr-6 rounded-lg"
            onClick={() => handleClick(id)}
        >
            <div className="flex flex-col items-start gap-[6px]">
                <span className="text-sm font-semibold hover:underline">{title}</span>
                <span className="text-xs font-normal">{author}</span>
            </div>
            <Image src={iconRightArrow} alt="" width={20} height={20} />
        </div>
    )
}

export default RecPosts