'use client'
import { useState } from 'react'

import Image from 'next/image'
import PopupWrapper from '../popup-wrapper'

import iconUpload from '@/icons/export.svg'
import DuplicatePopup from "@/components/shared/popup-duplicate"


type CreatePopupProps = {
    isOpen: boolean
    onClose: () => void
}

type ItemProps = {
    title: string
    // value: string
}

const Item = (props: ItemProps) => {
    return (
        <div className='flex flex-col gap-1 items-start w-full'>
            <span className='text-base font-normal w-full'>{props.title}</span>
            <input className='py-2 pl-3 rounded-lg bg-grey w-full text-base font-semibold focus-within:outline-none'>
                {/* <span className='text-base font-semibold'>{props.value}</span> */}
            </input>
        </div>
    )
}

const AddButton = ({ title, onClick }: { title: string, onClick: () => void }) => {
    return (
        <button
            className={`px-2 py-1 rounded-lg bg-white text-xs font-semibold`}
            onClick={onClick}
        >
            {title}
        </button>
    )
}

const ContentItem = (props: ItemProps) => {
    return (
        <div className='flex flex-col gap-1 items-start w-full'>
            <span className='text-base font-normal w-full'>{props.title}</span>
            <div className='flex flex-col gap-3 py-2 px-3 rounded-lg bg-grey w-full text-base font-semibold'>
                <textarea className='rounded-lg bg-grey w-full text-base font-semibold focus-within:outline-none'>
                </textarea>
                <div className='flex flex-row gap-5 items-end w-full justify-end'>
                    <AddButton title={'Add Photos'} onClick={() => { }} />
                    <AddButton title={'Add Links'} onClick={() => { }} />
                    <AddButton title={'Add Markdown'} onClick={() => { }} />
                </div>
            </div>
        </div>
    )
}

const CreatePostPopup = (props: CreatePopupProps) => {
    const handleUploadPost = () => {
        props.onClose()
        setIsOpenDuplicatePopup(true)
    }

    const [isOpenDuplicatePopup, setIsOpenDuplicatePopup] = useState(false)

    return (
        <>
            <PopupWrapper isOpen={props.isOpen} onClose={props.onClose} title={'Create a New Post'}>
                <div className='w-full min-w-[1000px] flex flex-col gap-5 pt-5 items-center'>
                    <span className='text-xl leading-8 font-semibold text-left w-full'>Add some basic information about your post</span>
                    <Item title={'Title *'} />
                    <Item title={'Tags *'} />
                    <ContentItem title={'Content'} />
                    <span className='text-xl leading-8 font-semibold text-left w-full'>Add your testcase</span>
                    <Item title={'Input *'} />
                    <Item title={'Expected Output *'} />
                    <button
                        className={`bg-green rounded-lg py-3 px-4 flex flex-row gap-2 items-center text-sm font-bold text-center hover:bg-grey transition-all duration-300`}
                        onClick={() => { handleUploadPost() }}
                    >
                        <span>Upload Post</span>
                        <Image src={iconUpload} alt='' />
                    </button>
                </div>
            </PopupWrapper>
            <DuplicatePopup isOpen={isOpenDuplicatePopup} onClose={() => setIsOpenDuplicatePopup(false)} />
        </>
    )
}

export default CreatePostPopup