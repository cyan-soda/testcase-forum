'use client'

import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next'

const PopupWrapper = dynamic(() => import('@/components/shared/popup-wrapper'), { ssr: false })

type PreviewPopupProps = {
    isOpen: boolean
    onClose: () => void
    testcase: {
        post_id?: string
        input: string
        expected: string
        code: string
    }
}

type ItemProps = {
    title: string
    value: string
}

const Item = (props: ItemProps) => {
    return (
        <div className='flex flex-col gap-1 items-start w-full'>
            <span className='text-base font-semibold w-full'>{props.title}</span>
            <div className='py-2 pl-3 rounded-lg bg-grey w-full'>
                {props.value.split('\n').map((line, index) => (
                    <span key={index} className='text-base font-normal block'>
                        {line}
                    </span>
                ))}
            </div>
        </div>
    )
}

const PreviewPopup = (props: PreviewPopupProps) => {
    const { t } = useTranslation("home")
    return (
        <PopupWrapper isOpen={props.isOpen} onClose={props.onClose} title={t('popup_preview.title')}>
            <div className='w-full min-w-[1000px] flex flex-col gap-5 pt-5 items-start'>
                <Item title={t('popup_preview.support_file') + ':'} value={props.testcase.input} />
                <Item title={t('popup_preview.expected_output') + ':'} value={props.testcase.expected} />
            </div>
        </PopupWrapper>
    )
}

export default PreviewPopup