'use client'

import axios from 'axios'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useState, useRef, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import iconUpload from '@/icons/export.svg'
// import { useUserStore } from '@/store/user/user-store'
import { postService } from '@/service/post'

const PopupWrapper = dynamic(() => import('@/components/shared/popup-wrapper'), { ssr: false })
const DuplicatePopup = dynamic(() => import('@/components/shared/popup-duplicate'), { ssr: false })

interface CreatePopupProps {
  isOpen: boolean
  onClose: () => void
}

interface ICreatePostForm {
  title: string
  description: string
  expected: string
  code: string
  input: File | null
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

// Yup schema for validation
const createPostSchema = Yup.object().shape({
  title: Yup.string().trim().required('Title is required'),
  description: Yup.string().trim().required('Description is required'),
  expected: Yup.string().trim().required('Expected output is required'),
  code: Yup.string().trim().required('Code is required'),
  input: Yup.mixed<File>()
    .required('A config.txt file is required')
    .test('fileName', 'File must be named config.txt', (value) => value && value.name === 'config.txt')
    .test('fileType', 'Only .txt files are allowed', (value) => value && value.type === 'text/plain'),
})

const CreatePostPopup = (props: CreatePopupProps) => {
  // const { user } = useUserStore()
  const [isDuplicatePopupOpen, setIsDuplicatePopupOpen] = useState(false)
  const [similarPosts, setSimilarPosts] = useState<SimilarPost[]>([])
  // const [postData, setPostData] = useState<ICreatePostForm | null>(null)
  const [postId, setPostId] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const [inputText, setInputText] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ICreatePostForm>({
    resolver: yupResolver(createPostSchema) as any,
    defaultValues: {
      title: '',
      description: '',
      expected: '',
      code: '',
      input: null,
    },
  })

  // Reset form when popup is closed
  useEffect(() => {
    if (!props.isOpen) {
      resetForm()
    }
  }, [props.isOpen])

  const resetForm = () => {
    reset()
    setFileName('')
    setInputText('')
    setSimilarPosts([])
    // setPostData(null)
    setPostId('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onSubmit = async (data: ICreatePostForm) => {
    // Ensure input is a File (validation ensures it's not null)
    if (!data.input) return

    setIsSubmitting(true)
    try {
      const response = await postService.createPostForm(
        data.title,
        data.description,
        data.expected,
        data.code,
        data.input
      )

      const status = response.status
      const responseData: PostResponse = response.data

      if (status === 201) {
        resetForm()
        props.onClose()
        alert('Post created successfully!')
      } else if (status === 202) {
        setPostId(responseData.post.id)
        if (responseData.similar_posts && responseData.similar_posts.length > 0) {
          setSimilarPosts(responseData.similar_posts)
          // setPostData(data)
          setIsDuplicatePopupOpen(true)
        } else {
          console.warn('No similar posts provided in 202 response')
        }
      } else {
        console.error('Unexpected status code:', status)
        alert('Unexpected error occurred. Please try again.')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message, error.response?.status)
        alert(`Failed to create post: ${error.response?.data?.message || error.message}`)
      } else {
        console.error('Unexpected error:', error)
        alert('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePostAnyway = async () => {
    if (!postId) {
      alert('No post ID available.')
      return
    }

    try {
      await postService.createPostAnyway(postId)
      resetForm()
      setIsDuplicatePopupOpen(false)
      props.onClose()
      alert('Post created successfully!')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message)
        alert(`Failed to post: ${error.response?.data?.message || error.message}`)
      } else {
        console.error('Unexpected error:', error)
        alert('An unexpected error occurred.')
      }
    }
  }

  const handleCancelPost = () => {
    console.log('Post cancelled')
    setIsDuplicatePopupOpen(false)
    resetForm()
  }

  const Item = ({ title, name, error }: {
    title: string
    name: keyof ICreatePostForm
    error?: string
  }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
      const textarea = textareaRef.current
      if (textarea) {
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
      }
    }, [])

    return (
      <div className='flex flex-col gap-1 items-start w-full'>
        <span className='text-base font-semibold w-full'>{title}</span>
        <div className='py-2 px-3 rounded-lg bg-grey w-full text-base'>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                ref={textareaRef}
                className='rounded-lg bg-grey w-full text-base focus-within:outline-none auto-resize'
                rows={1}
                value={typeof field.value === 'string' ? field.value : ''}
                onChange={(e) => {
                  field.onChange(e)
                  const target = e.target as HTMLTextAreaElement
                  target.style.height = 'auto'
                  target.style.height = `${target.scrollHeight}px`
                }}
              />
            )}
          />
        </div>
        {error && <span className='text-red-500 text-sm'>{error}</span>}
      </div>
    )
  }

  const FileItem = ({ title, name, error }: {
    title: string
    name: keyof ICreatePostForm
    error?: string
  }) => (
    <div className='flex flex-col gap-1 items-start w-full'>
      <span className='text-base font-semibold w-full'>{title}</span>
      <div className='py-2 px-3 rounded-lg bg-grey w-full text-base'>
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange } }) => (
            <div className='flex flex-row gap-3 items-center'>
              <label className='cursor-pointer px-4 py-2 rounded-lg bg-white flex items-center gap-2'>
                Choose File
                <input
                  type='file'
                  accept='.txt'
                  ref={fileInputRef}
                  className='hidden'
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    onChange(file)
                    setFileName(file ? file.name : '')
                    if (file) {
                      file.text().then((text) => setInputText(text))
                    } else {
                      setInputText('')
                    }
                  }}
                />
              </label>
              {fileName && <span className='ml-3 text-sm'>{fileName}</span>}
            </div>
          )}
        />
      </div>
      {error && <span className='text-red-500 text-sm'>{error}</span>}
    </div>
  )

  const ContentItem = ({ title, name, error }: {
    title: string
    name: keyof ICreatePostForm
    error?: string
  }) => (
    <div className='flex flex-col gap-1 items-start w-full'>
      <span className='text-base font-semibold w-full'>{title}</span>
      <div className='flex flex-col gap-3 py-2 px-3 rounded-lg bg-grey w-full text-base'>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              className='rounded-lg bg-grey w-full text-base focus-within:outline-none resize-none'
              rows={3}
              value={typeof field.value === 'string' ? field.value : ''}
              onChange={(e) => {
                field.onChange(e)
                const target = e.target as HTMLTextAreaElement
                target.style.height = 'auto'
                target.style.height = `${target.scrollHeight}px`
              }}
            />
          )}
        />
      </div>
      {error && <span className='text-red-500 text-sm'>{error}</span>}
    </div>
  )

  const InputItem = () => (
    <div className='flex flex-col gap-1 items-start w-full'>
      <span className='text-base font-semibold w-full'>Input</span>
      <div className='py-2 px-3 rounded-lg bg-grey w-full text-base'>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
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
          <Item
            title='Title *'
            name='title'
            error={errors.title?.message}
          />
          <ContentItem
            title='Content *'
            name='description'
            error={errors.description?.message}
          />
          <ContentItem
            title='Test Code *'
            name='code'
            error={errors.code?.message}
          />

          <span className='text-xl leading-8 font-semibold text-left w-full'>Add your testcase</span>
          <div className='w-full space-y-4'>
            <InputItem />
            <FileItem
              title='Support File (config.txt) *'
              name='input'
              error={errors.input?.message}
            />
          </div>
          <Item
            title='Expected Output *'
            name='expected'
            error={errors.expected?.message}
          />

          <button
            type='submit'
            disabled={isSubmitting}
            className={`bg-green rounded-lg py-3 px-4 flex flex-row gap-2 items-center text-sm font-bold text-center hover:bg-grey transition-all duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
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