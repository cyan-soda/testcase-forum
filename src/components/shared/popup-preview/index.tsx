'use client'

import PopupWrapper from '../popup-wrapper'

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
            <span className='text-base font-normal w-full'>{props.title}</span>
            <div className='py-2 pl-3 rounded-lg bg-grey w-full'>
                <span className='text-base font-semibold'>{props.value}</span>
            </div>
        </div>
    )
}

const PreviewPopup = (props: PreviewPopupProps) => {
    return (
        <PopupWrapper isOpen={props.isOpen} onClose={props.onClose} title={'Preview Testcase'}>
            <div className='w-full min-w-[1000px] flex flex-col gap-5 pt-5 items-start'>
                <Item title={'Input'} value={props.testcase.input} />
                <Item title={'Output'} value={props.testcase.expected} />
            </div>
        </PopupWrapper>
    )
}

export default PreviewPopup