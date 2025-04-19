'use client'

import axios from 'axios'
import { useForm, SubmitHandler } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useState } from 'react'

import iconUpload from '@/icons/export.svg'
import { useUserStore } from '@/store/user/user-store'
import { postService } from '@/service/post'

const PopupWrapper = dynamic(() => import('@/components/shared/popup-wrapper'), { ssr: false })
const DuplicatePopup = dynamic(() => import('@/components/shared/popup-duplicate'), { ssr: false })

interface CreatePopupProps {
    isOpen: boolean
    onClose: () => void
}

interface ICreatePostForm {
    title: string
    description?: string
    input: string
    expected: string
    code: string
}

interface SimilarPost {
    post_id: string
    title: string
    description: string
    author: string
    input: string
    expected: string
    similarity: number
}

interface PostResponse {
    post: {
        id: string
        mail: string
        subject: string
        title: string
        description: string
        last_modified: string
        testcase: {
            post_id: string
            input: string
            expected: string
            code: string
        }
        tags: string | null
    }
    similar_posts?: SimilarPost[]
}

const createPostSchema = yup.object().shape({
    title: yup.string().trim().required('Title is required'),
    description: yup.string().trim(),
    input: yup.string().trim().required('Input is required'),
    expected: yup.string().trim().required('Expected output is required'),
    code: yup.string().trim().required('Code is required'),
})

const CreatePostPopup = (props: CreatePopupProps) => {
    const { user } = useUserStore()
    const [isDuplicatePopupOpen, setIsDuplicatePopupOpen] = useState(false)
    const [similarPosts, setSimilarPosts] = useState<SimilarPost[]>([])
    const [postData, setPostData] = useState<ICreatePostForm | null>(null)
    const [postId, setPostId] = useState<string>('')

    type ItemProps = {
        title: string
        error?: string
    } & ReturnType<typeof register>

    const Item = ({ title, error, ...rest }: ItemProps) => (
        <div className='flex flex-col gap-1 items-start w-full'>
            <span className='text-base font-semibold w-full'>{title}</span>
            <div className='py-2 px-3 rounded-lg bg-grey w-full text-base'>
                <textarea
                    {...rest}
                    className='rounded-lg bg-grey w-full text-base focus-within:outline-none resize-none'
                    rows={1}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement
                        target.style.height = 'auto'
                        target.style.height = `${target.scrollHeight}px`
                    }}
                />
            </div>
            {error && <span className='text-red-500 text-sm'>{error}</span>}
        </div>
    )

    const AddButton = ({ title, onClick }: { title: string; onClick: () => void }) => {
        return (
            <button
                className={`px-2 py-1 rounded-lg bg-white text-xs font-semibold`}
                onClick={onClick}
            >
                {title}
            </button>
        )
    }

    const ContentItem = ({ title, error, ...rest }: ItemProps) => {
        return (
            <div className='flex flex-col gap-1 items-start w-full'>
                <span className='text-base font-semibold w-full'>{title}</span>
                <div className='flex flex-col gap-3 py-2 px-3 rounded-lg bg-grey w-full text-base'>
                    <textarea
                        {...rest}
                        className='rounded-lg bg-grey w-full text-base focus-within:outline-none resize-none'
                        rows={1}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement
                            target.style.height = 'auto'
                            target.style.height = `${target.scrollHeight}px`
                        }}
                    />
                    <div className='flex flex-row gap-5 items-end w-full justify-end'>
                        <AddButton title={'Add Photos'} onClick={() => {}} />
                    </div>
                </div>
                {error && <span className='text-red-500 text-sm'>{error}</span>}
            </div>
        )
    }

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ICreatePostForm>({
        resolver: yupResolver(createPostSchema),
    })

    const onSubmit: SubmitHandler<ICreatePostForm> = async (data) => {
        try {
            const response = await postService.createPostForm(
                data.title,
                data.description || '',
                data.input,
                data.expected,
                data.code
            )

            const status = response.status
            const responseData: PostResponse = response.data

            if (status === 201) {
                // No similar posts, post is uploaded
                reset()
                props.onClose()
            } else if (status === 302) {
                // Similar posts found, open DuplicatePopup
                setPostId(responseData.post.id)
                if (responseData.similar_posts && responseData.similar_posts.length > 0) {
                    setSimilarPosts(responseData.similar_posts)
                    setPostData(data)
                    setIsDuplicatePopupOpen(true)
                } else {
                    console.warn('No similar posts provided in 302 response')
                }
            } else {
                console.error('Unexpected status code:', status)
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response?.data || error.message, error.response?.status)
            } else {
                console.error('Unexpected error:', error)
            }
        }
    }

    const handlePostAnyway = async () => {
        if (!postId) {
            // console.error('No postId available for posting anyway')
            return
        }

        try {
            await postService.createPostAnyway(postId)
            // console.log('Post uploaded successfully after confirmation')
            reset()
            setIsDuplicatePopupOpen(false)
            props.onClose()
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response?.data || error.message)
            } else {
                console.error('Unexpected error:', error)
            }
        }
    }

    const handleCancelPost = () => {
        console.log('Post cancelled')
        setIsDuplicatePopupOpen(false)
        setPostData(null)
        setSimilarPosts([])
        setPostId('')
    }

    return (
        <>
            <PopupWrapper isOpen={props.isOpen} onClose={props.onClose} title='Create a New Post'>
                <form
                    className='w-full min-w-[1000px] flex flex-col gap-5 pt-5 items-center'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <span className='text-xl leading-8 font-semibold text-left w-full'>
                        Add some basic information about your post
                    </span>
                    <Item title='Title *' {...register('title', { required: true })} error={errors.title?.message} />
                    <ContentItem title='Content' {...register('description')} error={errors.description?.message} />
                    <Item
                        title='Test Code *'
                        {...register('code', { required: true })}
                        error={errors.code?.message}
                    />

                    <span className='text-xl leading-8 font-semibold text-left w-full'>Add your testcase</span>
                    <Item title='Input *' {...register('input')} error={errors.input?.message} />
                    <Item title='Expected Output *' {...register('expected')} error={errors.expected?.message} />

                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className={`bg-green rounded-lg py-3 px-4 flex flex-row gap-2 items-center text-sm font-bold text-center hover:bg-grey transition-all duration-300 ${
                            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        <span>{isSubmitting ? 'Uploading...' : 'Upload Post'}</span>
                        <Image src={iconUpload} alt='' />
                    </button>
                </form>
            </PopupWrapper>

            <DuplicatePopup
                isOpen={isDuplicatePopupOpen}
                onClose={handleCancelPost}
                similarPosts={similarPosts}
                onPostAnyway={handlePostAnyway}
            />
        </>
    )
}

export default CreatePostPopup