import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next'
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

const Item = (props: { title: string, author: string, input: string, output: string, id: string }) => {
    const { t } = useTranslation('popup')
    return (
        <div className='flex flex-col gap-1 items-start w-full'>
            <div className='flex flex-row items-center gap-1'>
                <span className='text-base font-semibold'>{t('popup_duplicate.item.title')}</span>
                <span className='text-base font-normal hover:underline hover:cursor-pointer' onClick={() => { window.open(`/space/CO1005/242/${props.id}`, '_blank') }}>{props.title}</span>
                <span className='text-base font-semibold'>{' '}{t('popup_duplicate.item.author')}</span>
                <span className='text-base font-normal'>{props.author}</span>
            </div>
            <div className="flex flex-col items-start gap-2 w-full my-2 p-4 border rounded-lg">
                <div className="grid grid-cols-[8rem_1fr] items-center gap-2 w-full">
                    <span className="text-sm font-semibold">{t('popup_duplicate.item.support_file')}</span>
                    <span className="bg-grey py-2 px-3 rounded-lg whitespace-pre-wrap break-words break-all">
                        {props.input.split('\n').map((line, index) => (
                            <span key={index} className='text-base font-normal'>{line}</span>
                        ))}
                    </span>
                </div>
                <div className="grid grid-cols-[8rem_1fr] items-center gap-2 w-full">
                    <span className="text-sm font-semibold">{t('popup_duplicate.item.expected')}</span>
                    <span className="bg-grey py-2 px-3 rounded-lg whitespace-pre-wrap break-words break-all">
                        {props.output.split('\n').map((line, index) => (
                            <span key={index} className='text-base font-normal'>{line}</span>
                        ))}
                    </span>
                </div>
            </div>
        </div>
    )
}

const DuplicatePopup = (props: DuplicatePopupProps) => {
    const { t } = useTranslation('popup')
    return (
        <PopupWrapper isOpen={props.isOpen} onClose={props.onClose} title={t('popup_duplicate.title')}>
            <div className='w-full min-w-[1000px] flex flex-col gap-5 pt-5 items-center'>
                <span className='text-xl leading-8 font-semibold text-left w-full'>
                    {t('popup_duplicate.sub_1')}
                </span>
                {props.similarPosts.map((item, index) => (
                    <Item
                        key={index}
                        title={item.title}
                        author={item.author}
                        input={item.input}
                        output={item.expected}
                        id={item.post_id}
                    />
                ))}
                <span className='text-xl leading-8 font-semibold text-left w-full'>
                    {t('popup_duplicate.sub_2')}
                </span>
                <div className='flex flex-row gap-3 items-end w-full justify-center'>
                    <button
                        className={`bg-grey rounded-lg py-3 px-4 text-sm font-bold text-center hover:bg-grey transition-all duration-300`}
                        onClick={props.onClose}
                    >
                        {t('popup_duplicate.button_cancel')}
                    </button>
                    <button
                        className={`bg-green rounded-lg py-3 px-4 text-sm font-bold text-center hover:bg-green transition-all duration-300`}
                        onClick={props.onPostAnyway}
                    >
                        {t('popup_duplicate.button_continue')}
                    </button>
                </div>
            </div>
        </PopupWrapper>
    )
}

export default DuplicatePopup