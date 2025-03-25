'use client'

import { useState } from 'react';
import axios from 'axios'

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
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    // value: string
}

const Item = (props: ItemProps) => {
    return (
        <div className='flex flex-col gap-1 items-start w-full'>
            <span className='text-base font-normal w-full'>{props.title}</span>
            <input className='py-2 pl-3 rounded-lg bg-grey w-full text-base font-semibold focus-within:outline-none'
                            value={props.value}
                            onChange={props.onChange}>
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
                <textarea className='rounded-lg bg-grey w-full text-base font-semibold focus-within:outline-none'
                                    value={props.value}
                                    onChange={props.onChange}>
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
    const [title, setTitle] = useState('')
    const [tags, setTags] = useState('')
    const [description, setDescription] = useState('')
    const [input, setInput] = useState('')
    const [expected, setExpected] = useState('')
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
        console.error("Người dùng chưa đăng nhập!");
        return;
    }

    const user = JSON.parse(storedUser);
    const email = user.mail;
    const handleUploadPost = async () => {
        console.log(email);
        const postData = {
            title,
            tags: tags.split(',').map(tag => tag.trim()),
            description,
            testcase: {
                input,
                expected: expected,
            },
            user_mail: email,
        }

        try {
            const response = await axios.post('http://127.0.0.1:3000/create', postData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            console.log('Post uploaded successfully:', response.data)
            props.onClose()
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response?.data || error.message)
            } else {
                console.error('Unexpected error:', error)
            }
        }
    }

    const [isOpenDuplicatePopup, setIsOpenDuplicatePopup] = useState(false)

    return (
        <PopupWrapper isOpen={props.isOpen} onClose={props.onClose} title={'Create a New Post'}>
            <div className='w-full min-w-[1000px] flex flex-col gap-5 pt-5 items-center'>
                <span className='text-xl leading-8 font-semibold text-left w-full'>Add some basic information about your post</span>
                <Item title={'Title *'} value={title} onChange={(e) => setTitle(e.target.value)}/>
                <Item title={'Tags *'} value={tags} onChange={(e) => setTags(e.target.value)}/>
                <ContentItem title={'Content'} value={description} onChange={(e) => setDescription(e.target.value)}/>
                <span className='text-xl leading-8 font-semibold text-left w-full'>Add your testcase</span>
                <Item title={'Input *'} value={input} onChange={(e) => setInput(e.target.value)} />
                <Item title={'Expected Output *'} value={expected} onChange={(e) => setExpected(e.target.value)} />
                <button
                    className={`bg-green rounded-lg py-3 px-4 flex flex-row gap-2 items-center text-sm font-bold text-center hover:bg-grey transition-all duration-300`}
                    onClick={() => {handleUploadPost()}}
                >
                    <span>Upload Post</span>
                    <Image src={iconUpload} alt='' />
                </button>
            </div>
        </PopupWrapper>
    )
}

export default CreatePostPopup