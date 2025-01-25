'use client'

import PopupWrapper from '../popup-wrapper'

type PreviewPopupProps = {
    isOpen: boolean
    onClose: () => void
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
                <Item title={'Input'} value={'123456'} />
                <Item title={'Output'} value={'True'} />
            </div>
        </PopupWrapper>
    )
}

export default PreviewPopup