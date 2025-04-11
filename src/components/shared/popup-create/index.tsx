'use client'

import axios from 'axios'
import { useForm, SubmitHandler } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"

import Image from 'next/image'
import PopupWrapper from '../popup-wrapper'

import iconUpload from '@/icons/export.svg'
import { useUserStore } from '@/store/user/user-store'
import { postService } from '@/service/post'

interface CreatePopupProps {
    isOpen: boolean
    onClose: () => void
}

interface ICreatePostForm {
    title: string
    tags: string
    description?: string
    input: string
    expected: string
    code: string
}

const createPostSchema = yup.object().shape({
    title: yup.string().trim().required("Title is required"),
    tags: yup.string().trim().required("Tags are required"),
    description: yup.string().trim(),
    input: yup.string().trim().required("Input is required"),
    expected: yup.string().trim().required("Expected output is required"),
    code: yup.string().trim().required("Code is required"),
})

const CreatePostPopup = (props: CreatePopupProps) => {
    const { user } = useUserStore()

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
        </div>
    )

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
                        <AddButton title={'Add Photos'} onClick={() => { }} />
                    </div>
                </div>
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
        // defaultValues: {
        //     title: "",
        //     tags: "",
        //     description: "",
        //     input: "",
        //     expected: "",
        //     code: "",
        // },
    })

    const onSubmit: SubmitHandler<ICreatePostForm> = async (data) => {
        try {
            // console.log("Posting as user:", user?.mail)
            const response = await postService.createPostForm(
                data.title,
                data.description || "",
                data.input,
                data.expected,
                data.code
            )
            // console.log("Post uploaded successfully:", response)
            reset()
            props.onClose()
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response?.data || error.message)
            } else {
                console.error("Unexpected error:", error)
            }
        }
    }

    return (
        <PopupWrapper isOpen={props.isOpen} onClose={props.onClose} title="Create a New Post">
            <form
                className="w-full min-w-[1000px] flex flex-col gap-5 pt-5 items-center"
                onSubmit={handleSubmit(onSubmit)}
            >
                <span className="text-xl leading-8 font-semibold text-left w-full">
                    Add some basic information about your post
                </span>
                <Item title="Title *" {...register("title", { required: true })} error={errors.title?.message} />
                <Item title="Tags *" {...register("tags", { required: true })} error={errors.tags?.message} />
                <ContentItem title="Content *" {...register("description")} error={errors.description?.message} />
                <Item title="Executable Code *" {...register("code", { required: true })} error={errors.code?.message} />

                <span className="text-xl leading-8 font-semibold text-left w-full">Add your testcase</span>
                <Item title="Input *" {...register("input")} error={errors.input?.message} />
                <Item title="Expected Output *" {...register("expected")} error={errors.expected?.message} />
                
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-green rounded-lg py-3 px-4 flex flex-row gap-2 items-center text-sm font-bold text-center hover:bg-grey transition-all duration-300 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    <span>{isSubmitting ? "Uploading..." : "Upload Post"}</span>
                    <Image src={iconUpload} alt="" />
                </button>
            </form>
        </PopupWrapper>
    )
}

export default CreatePostPopup