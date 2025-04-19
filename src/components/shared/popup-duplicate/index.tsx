import dynamic from 'next/dynamic'
const PopupWrapper = dynamic(() => import('@/components/shared/popup-wrapper'), { ssr: false })

interface SimilarPost {
    post_id: string
    title: string
    description: string
    author: string
    input: string
    expected: string
    similarity: number
}

interface DuplicatePopupProps {
    isOpen: boolean
    onClose: () => void
    similarPosts: SimilarPost[]
    onPostAnyway: () => void
}

const Item = (props: {title: string, author: string, input: string, output: string}) => {
    return (
        <div className='flex flex-col gap-1 items-start w-full'>
            <div className='flex flex-row items-center gap-1'>
                <span className='text-base font-semibold'>Posted in</span>
                <span className='text-base font-normal hover:underline hover:cursor-pointer'>{props.title}</span>
                <span className='text-base font-semibold'>{' '}by</span>
                <span className='text-base font-normal'>{props.author}</span>
            </div>
            <div className='flex flex-col gap-1 py-2 px-3 rounded-lg bg-grey w-full text-base font-semibold'>
                <span className='text-base font-semibold'>Input: <span className='font-normal'>{props.input}</span></span>
                <span className='text-base font-semibold'>Output: <span className='font-normal'>{props.output}</span></span>
            </div>
        </div>
    )
}   

const DuplicatePopup = (props: DuplicatePopupProps) => {
    return (
        <PopupWrapper isOpen={props.isOpen} onClose={props.onClose} title='Duplicates Warning'>
            <div className='w-full min-w-[1000px] flex flex-col gap-5 pt-5 items-center'>
                <span className='text-xl leading-8 font-semibold text-left w-full'>
                    We have found some testcases that are highly similar to your testcase:
                </span>
                {props.similarPosts.map((item, index) => (
                    <Item
                        key={index}
                        title={item.title}
                        author={item.author}
                        input={item.input}
                        output={item.expected}
                    />
                ))}
                <span className='text-xl leading-8 font-semibold text-left w-full'>
                    Are you sure about posting your testcase?
                </span>
                <div className='flex flex-row gap-3 items-end w-full justify-center'>
                    <button
                        className={`bg-grey rounded-lg py-3 px-4 text-sm font-bold text-center hover:bg-grey transition-all duration-300`}
                        onClick={props.onClose}
                    >
                        No, cancel my post
                    </button>
                    <button
                        className={`bg-green rounded-lg py-3 px-4 text-sm font-bold text-center hover:bg-green transition-all duration-300`}
                        onClick={props.onPostAnyway}
                    >
                        Yes, I'm sure about posting
                    </button>
                </div>
            </div>
        </PopupWrapper>
    )
}

export default DuplicatePopup